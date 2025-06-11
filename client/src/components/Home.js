import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddToWatchListButton from "./AddToWatchListButton";
import { useUser } from "../contexts/UserContext";
import styled from "styled-components";

const Home = () => {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShows = async () => {
            const response = await fetch(
                "https://api.themoviedb.org/3/tv/popular?api_key=d4ddced88a330db763b27c60405997f2"
            );
            const data = await response.json();
            setShows(data.results);
            setLoading(false);
        };

        fetchShows();
    }, []);

    const handleShowDetails = (showName) => {
        navigate(`/show/${encodeURIComponent(showName)}`); 
    };

    return (
        <Wrapper>
            <Title>Welcome to TV Show Tracker</Title>
            {loading ? (
                <p>Loading popular shows...</p>
            ) : (
                <Section>
                    <Subtitle>Popular Shows</Subtitle>
                    <ShowGrid>
                        {shows.map((show) => {
                            const alreadyInWatchList = user?.shows?.some(
                                (s) => s.id === show.id
                            );
                            return (
                                <ShowCard key={show.id}>
                                    <Poster
                                        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                        alt={show.name}
                                    />
                                    <ShowName>{show.name}</ShowName>
                                    <Overview>{show.overview}</Overview>
                                    <ButtonWrapper>
                                        <DetailsButton onClick={() => handleShowDetails(show.name)}>
                                            View Details
                                        </DetailsButton>
                                    </ButtonWrapper>
                                    {!alreadyInWatchList ? (
                                        <AddToWatchListButton
                                            showName={show.name}
                                            showPosterPath={show.poster_path}
                                        />
                                    ) : (
                                        <Note>Already in your Watchlist</Note>
                                    )}
                                </ShowCard>
                            );
                        })}
                    </ShowGrid>
                </Section>
            )}
        </Wrapper>
    );
};

export default Home;


const Wrapper = styled.div`
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 32px;
    margin-bottom: 20px;
`;

const Subtitle = styled.h2`
    font-size: 24px;
    margin-bottom: 16px;
`;

const Section = styled.div`
    margin-top: 20px;
`;

const ShowGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;

const ShowCard = styled.div`
    width: 200px;
    background: #f8f8f8;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const Poster = styled.img`
    width: 100%;
    border-radius: 8px;
`;

const ShowName = styled.h3`
    font-size: 18px;
    margin: 10px 0 6px;
`;

const Overview = styled.p`
    font-size: 14px;
    margin-bottom: 10px;
    height: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Note = styled.p`
    font-size: 14px;
    font-style: italic;
    color: #666;
`;

const ButtonWrapper = styled.div`
    margin-top: 10px;
`;

const DetailsButton = styled.button`
    background-color: #4caf50;
    color: white;
    padding: 0.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }
`;
