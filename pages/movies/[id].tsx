import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";
import styled from "styled-components";

interface Rating {
  Source: string;
  Value: string;
}

interface MovieDetails {
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
  Actors: string;
  Ratings: Rating[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem 0;
`;

const Image = styled.img`
  width: 300px;
  height: auto;
  margin: 1rem 0;
`;

const Detail = styled.p`
  font-size: 1.2rem;
  margin: 0.5rem 0;
`;

const RatingList = styled.div`
  margin: 1rem 0;
`;

const RatingItem = styled.span`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const Loading = styled.p`
  font-size: 1.2rem;
`;

const Content = styled.div`
  width: 90%;
  max-width: 1000px;
`;

const ResponsiveContainer = styled(Container)`
  ${Content} {
    width: 100%;
  }

  ${Title} {
    font-size: 1.5rem;
    margin: 0.5rem 0;
  }

  ${Image} {
    width: 100%;
    max-width: 500px;
  }

  ${Detail} {
    font-size: 1rem;
    margin: 0.3rem 0;
  }

  ${RatingItem} {
    font-size: 1rem;
  }

  @media (min-width: 768px) {
    ${Title} {
      font-size: 2rem;
      margin: 1rem 0;
    }

    ${Image} {
      margin: 1rem 0;
    }

    ${Detail} {
      font-size: 1.2rem;
      margin: 0.5rem 0;
    }

    ${RatingItem} {
      font-size: 1.2rem;
    }
  }
`;

export default function Movie() {
  const router = useRouter();
  const { id } = router.query;
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&i=${id}`
        );
        setMovieDetails(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (!movieDetails) {
    return <Loading>Loading...</Loading>;
  }

  return (
    <ResponsiveContainer>
      <Content>
        <Title>{movieDetails.Title}</Title>
        <Image src={movieDetails.Poster} alt={movieDetails.Title} />
        <Detail>Year: {movieDetails.Year}</Detail>
        <Detail>Plot: {movieDetails.Plot}</Detail>
        <Detail>Actors: {movieDetails.Actors}</Detail>
        <RatingList>
          <Detail>Ratings:</Detail>
          {movieDetails.Ratings.map((rating, index) => (
            <RatingItem key={index}>
              {rating.Source} ({rating.Value})
            </RatingItem>
          ))}
        </RatingList>
      </Content>
    </ResponsiveContainer>
  );
}
