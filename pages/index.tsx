import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { Container, Form, FormControl, Button, Card } from "react-bootstrap";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await axios.get("http://www.omdbapi.com", {
        params: {
          apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
          s: searchQuery,
          type: "movie",
        },
      });

      if (response.data.Error) {
        setError(response.data.Error);
      } else {
        setMovies(response.data.Search);
        setError(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };

  return (
    <Container className="my-4">
      <Head>
        <title>My Movie Search App</title>
      </Head>

      <Form onSubmit={handleSearch}>
        <FormControl
          type="text"
          placeholder="Search for a movie by title..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          disabled={loading}
        />
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </Form>

      {error && <p className="mt-3 text-danger">{error}</p>}

      {movies.length === 0 && !loading && !error && (
        // eslint-disable-next-line react/no-unescaped-entities
        <p className="mt-3">No movies found for "{searchQuery}"</p>
      )}

      {movies.length > 0 && (
        <div className="mt-3">
          <h2 className="mb-3">Search Results:</h2>

          {movies.map((movie) => (
            <Card
              key={movie.imdbID}
              className="mb-3"
              onClick={() => handleMovieClick(movie.imdbID)}
              style={{ cursor: "pointer" }}
            >
              <Card.Img variant="top" src={movie.Poster} />
              <Card.Body>
                <Card.Title>{movie.Title}</Card.Title>
                <Card.Text>{movie.Year}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
