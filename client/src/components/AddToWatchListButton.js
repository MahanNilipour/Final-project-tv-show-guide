import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";

const AddToWatchListButton = ({ showName, showPosterPath }) => {
    const { user, addShowToShows } = useUser();
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        if (!user) return alert("You must be logged in.");
        
        const isAlreadyInWatchlist = user.shows.some(show => show.name === showName);
        if (isAlreadyInWatchlist) {
            return alert(`"${showName}" is already in your watchlist.`);
        }
        setIsAdding(true);
        try {
            const response = await fetch("/addShowToUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    showName,
                    userId: user.id,
                    posterPath: showPosterPath,
                }),
            });
            const data = await response.json();
            if (response.ok && response.status === 200) {
                addShowToShows(data.show);
                alert(`"${data.show.name}" added to your watchlist!`);
            } else {
                alert(data.error || "Failed to add show");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        } finally {
            setIsAdding(false);
        }
    };
    return (
        <button onClick={handleAdd} disabled={isAdding}>
            {isAdding ? "Adding..." : "Add to Watchlist"}
        </button>
    );
};

export default AddToWatchListButton;
