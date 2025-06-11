import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import styled from "styled-components";
import AddToWatchListButton from "./AddToWatchListButton"; 

const ShowDetails = () => {
    const { showId } = useParams();
    const [show, setShow] = useState(null);
    const [message, setMessage] = useState("");
    const [details, setDetails] = useState({});
    const { user } = useUser(); 

    useEffect(() => {
        const fetchShowDetails = async () => {
            const decodedShowName = decodeURIComponent(showId);
            const response = await fetch(`/searchShow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ showName: decodedShowName }),
            });
            const data = await response.json();
            if (data.error) {
                setMessage(data.error);
            } else {
                setShow(data[0]); 
            }
        };

        fetchShowDetails();
    }, [showId]);

    const handleViewDetails = async () => {
        if (details[show.id]) {
            const newDetails = { ...details };
            delete newDetails[show.id];
            setDetails(newDetails);
            return;
        }
        try {
            const searchResultResponse = await fetch(
                `https://api.themoviedb.org/3/search/tv?api_key=d4ddced88a330db763b27c60405997f2&query=${encodeURIComponent(
                    show.name
                )}`
            );
            const searchData = await searchResultResponse.json();
            const foundShowData = searchData.results?.[0];
            if (!foundShowData) return alert("Show not found on TMDB");
            const detailResponse = await fetch(
                `https://api.themoviedb.org/3/tv/${foundShowData.id}?api_key=d4ddced88a330db763b27c60405997f2`
            );
            const showDetails = await detailResponse.json();

            const formatted = {
                seasons: showDetails.seasons
                    .filter((season) => season.name.toLowerCase() !== "specials")
                    .map((seasonObj) => ({
                        name: seasonObj.name,
                        episodeCount: seasonObj.episode_count,
                    })),
            };

            setDetails((prev) => ({ ...prev, [show.id]: formatted }));
        } catch (err) {
            console.error(err);
            alert("Could not fetch show details.");
        }
    };
    if (!show) {
        return <p>Loading show details...</p>;
    }
    return (
        <Wrapper>
            {message && <Message>{message}</Message>}
            <ShowCard>
                <ShowPoster
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                />
                <ShowInfo>
                    <ShowName>{show.name}</ShowName>
                    <Overview>{show.overview}</Overview>
                    <SeasonCount>
                        {details[show.id] ? (
                            <SeasonList>
                                {details[show.id].seasons.map((season, index) => (
                                    <SeasonItem key={index}>
                                        {season.name} ({season.episodeCount} episodes)
                                    </SeasonItem>
                                ))}
                            </SeasonList>
                        ) : (
                            <ViewButton onClick={handleViewDetails}>View Seasons</ViewButton>
                        )}
                    </SeasonCount>
                    {/* Use the AddToWatchListButton component here */}
                    <AddToWatchListButton showName={show.name} showPosterPath={show.poster_path} />
                </ShowInfo>
            </ShowCard>
        </Wrapper>
    );
};

export default ShowDetails;

const Wrapper = styled.div`
    padding: 20px;
    color: #fff;
`;

const Message = styled.p`
    font-size: 1.2rem;
    color: #ff0000;
    text-align: center;
`;

const ShowCard = styled.div`
    background-color: #333;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
    align-items: center;
`;

const ShowPoster = styled.img`
    width: 150px;
    height: 225px;
    border-radius: 8px;
`;

const ShowInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
`;

const ShowName = styled.h2`
    font-size: 2rem;
    font-weight: bold;
`;

const Overview = styled.p`
    font-size: 1rem;
    color: #aaa;
    line-height: 1.5;
    height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const SeasonCount = styled.div`
    margin-top: 10px;
`;

const ViewButton = styled.button`
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }
`;

const SeasonList = styled.ul`
    padding-left: 20px;
`;

const SeasonItem = styled.li`
    margin-bottom: 5px;
    font-size: 1rem;
`;
