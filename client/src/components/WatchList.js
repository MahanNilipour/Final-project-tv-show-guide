import React, { useState } from "react";
import styled from "styled-components";
import { useUser } from "../contexts/UserContext";

const WatchList = () => {
    const { user, removeShowFromShows, updateShowStatusInContext, updateShowProgress } = useUser();
    const [details, setDetails] = useState({});

    const handleRemove = async (showId) => {
        try {
            const response = await fetch("/removeShowFromUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, showId }),
            });
            const data = await response.json();
            if (response.ok) {
                removeShowFromShows(showId);
                alert("Show removed from watchlist.");
            } else {
                alert(data.error || "Failed to remove show.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    };

    const handleViewDetails = async (showId, showName) => {
        if (details[showId]) {
            const newDetails = { ...details };
            delete newDetails[showId];
            setDetails(newDetails);
            return;
        }
        try {
            const searchResultResponse = await fetch(
                `https://api.themoviedb.org/3/search/tv?api_key=d4ddced88a330db763b27c60405997f2&query=${encodeURIComponent(
                    showName
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

            setDetails((prev) => ({ ...prev, [showId]: formatted }));
        } catch (err) {
            console.error(err);
            alert("Could not fetch show details.");
        }
    };

    const handleStatusChange = async (showId, newStatus) => {
        try {
            const response = await fetch("/updateShowStatus", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, showId, newStatus }),
            });
            if (!response.ok) {
                const data = await response.json();
                return alert(data.error || "Failed to update status.");
            }
            updateShowStatusInContext(showId, newStatus);
        } catch (err) {
            console.error(err);
            alert("Something went wrong while updating the status.");
        }
    };

    const handleSeasonToggle = async (showId, seasonName, isCompleted) => {
        const newEpisode = isCompleted ? null : "completed"; 
        try {
            const response = await fetch("/updateShowProgress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    showId,
                    seasonName,
                    episode: newEpisode, 
                }),
            });
            if (!response.ok) {
                const data = await response.json();
                return alert(data.error || "Failed to update progress");
            }
            updateShowProgress(showId, seasonName, newEpisode);
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    };
    if (!user) {
        return <Message>You must be logged in to view your watch list.</Message>;
    }
    return (
        <Wrapper>
            <h2>{user.name}'s Watchlist</h2>
            {user.shows && user.shows.length > 0 ? (
                <ShowList>
                    {user.shows.map((show, index) => (
                        <ShowCard key={`${show.id}-${index}`}>
                            {show.poster_path ? (
                                <Poster
                                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                    alt={show.name}
                                />
                            ) : (
                                <NoImageText>No image available</NoImageText>
                            )}
                            <h3>{show.name}</h3>
                            <p>Status: {show.status}</p>
                            <StatusDropdown
                                value={show.status}
                                onChange={(ev) => handleStatusChange(show.id, ev.target.value)}
                            >
                                <option value="to-watch">To Watch</option>
                                <option value="watching">Watching</option>
                                <option value="completed">Completed</option>
                            </StatusDropdown>
                            <ActionButton onClick={() => handleViewDetails(show.id, show.name)}>
                                {details[show.id] ? "Hide Details" : "View Details"}
                            </ActionButton>
                            {details[show.id] && (
                                <SeasonList>
                                    {details[show.id].seasons.map((season, seasonIndex) => {
                                        const isCompleted = show.details?.some(
                                            (entry) =>
                                                entry.season === season.name &&
                                                entry.episode === "completed"
                                        );
                                        return (
                                            <SeasonItem key={seasonIndex}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={isCompleted}
                                                        onChange={() =>
                                                            handleSeasonToggle(
                                                                show.id,
                                                                season.name,
                                                                isCompleted
                                                            )
                                                        }
                                                    />
                                                    {season.name} ({season.episodeCount} episodes)
                                                </label>
                                            </SeasonItem>
                                        );
                                    })}
                                </SeasonList>
                            )}
                            <RemoveButton onClick={() => handleRemove(show.id)}>
                                Remove
                            </RemoveButton>
                        </ShowCard>
                    ))}
                </ShowList>
            ) : (
                <Message>No shows in your watch list yet.</Message>
            )}
        </Wrapper>
    );
};

export default WatchList;

const Wrapper = styled.div`
    padding: 2rem;
    color: white;
`;

const ShowList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
`;

const ShowCard = styled.div`
    background-color: #333;
    padding: 1rem;
    border-radius: 8px;
    width: 250px;
    text-align: center;
`;

const Poster = styled.img`
    width: 100%;
    border-radius: 8px;
`;

const NoImageText = styled.p`
    color: #ffb3b3;
    font-size: 0.9rem;
    font-style: italic;
`;

const ActionButton = styled.button`
    margin-top: 0.5rem;
    background-color: #61dafb;
    color: #000;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #21a1f1;
    }
`;

const RemoveButton = styled.button`
    margin-top: 0.5rem;
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #ff1a1a;
    }
`;

const SeasonList = styled.ul`
    margin-top: 1rem;
    text-align: left;
    padding-left: 1rem;
    font-size: 0.9rem;
`;

const SeasonItem = styled.li`
    margin-bottom: 0.3rem;
`;

const Message = styled.p`
    font-size: 1.2rem;
`;

const StatusDropdown = styled.select`
    margin-top: 0.5rem;
    padding: 0.4rem;
    border-radius: 4px;
    border: none;
    background-color: #444;
    color: white;

    &:focus {
        outline: none;
        border: 1px solid #61dafb;
    }
`;
