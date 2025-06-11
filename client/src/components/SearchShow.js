import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import AddToWatchListButton from "./AddToWatchListButton";
import { useUser } from "../contexts/UserContext";
import styled from "styled-components";

const SearchShow = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const showName = queryParams.get("query");

    const [searchResults, setSearchResults] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            if (!showName) return;
            try {
                const response = await fetch("/searchShow", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ showName }),
                });

                const data = await response.json();
                if (response.ok) {
                    setSearchResults(data);
                    setMessage("");
                } else {
                    setMessage(data.error || "Something went wrong");
                    setSearchResults([]);
                }
            } catch (err) {
                console.error(err);
                setMessage("Internal server error");
            }
        };

        fetchResults();
    }, [showName]);

    const { user } = useUser();

    return (
        <Wrapper>
            <Title>Search Results for: {showName}</Title>
            {message && <p>{message}</p>}
            <ShowGrid>
                {searchResults.map((show) => {
                    const alreadyInWatchList = user?.shows?.some((s) => s.id === show.id);
                    return (
                        <ShowCard key={show.id}>
                            <Poster
                                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                alt={show.name}
                            />
                            <ShowName>{show.name}</ShowName>
                            <Overview>{show.overview}</Overview>
                            {!alreadyInWatchList && (
                                <AddToWatchListButton
                                    showName={show.name}
                                    showPosterPath={show.poster_path}
                                />
                            )}
                            {alreadyInWatchList && <Note>Already in your Watchlist</Note>}
                            <Link to={`/show/${encodeURIComponent(show.name)}`}>
                                <DetailsButton>View Details</DetailsButton>
                            </Link>
                        </ShowCard>
                    );
                })}
            </ShowGrid>
        </Wrapper>
    );
};

export default SearchShow;

const Wrapper = styled.div`
    padding: 20px;
`;

const Title = styled.h2`
    font-size: 24px;
    margin-bottom: 16px;
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
