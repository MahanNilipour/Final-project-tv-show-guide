import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const setUserData = (userData) => {
        setUser(userData);
    };

    const clearUser = () => {
        setUser(null);
    };

    const addShowToShows = (showObject) => {
        const newUser = { ...user };
        newUser.shows.push(showObject);
        setUser(newUser);
    };

    const removeShowFromShows = (showId) => {
        const newUser = { ...user };
        newUser.shows = newUser.shows.filter((show) => show.id !== showId);
        setUser(newUser);
    };

    const updateShowStatusInContext = (showId, newStatus) => {
        const newUser = { ...user };
        const showToUpdate = newUser.shows.find((show) => show.id === showId);
        if (showToUpdate) {
            showToUpdate.status = newStatus;
            setUser(newUser);
        }
    };

    const updateShowProgress = (showId, seasonName, episodeValue) => {
        const newUser = { ...user };
        const showToUpdate = newUser.shows.find((show) => show.id === showId);
        if (showToUpdate) {
            if (!showToUpdate.details) {
                showToUpdate.details = [];
            }
            if (episodeValue === "completed") {
                const alreadyExists = showToUpdate.details.some(
                    (entry) => entry.season === seasonName && entry.episode === "completed"
                );
                if (!alreadyExists) {
                    showToUpdate.details.push({ season: seasonName, episode: "completed" });
                }
            } else {
                showToUpdate.details = showToUpdate.details.filter(
                    (entry) => entry.season !== seasonName
                );
            }

            setUser(newUser);
        }
    };
    return (
        <UserContext.Provider
            value={{
                user,
                setUserData,
                clearUser,
                addShowToShows,
                removeShowFromShows,
                updateShowStatusInContext,
                updateShowProgress,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
