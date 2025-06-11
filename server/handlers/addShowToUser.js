const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, TMDB_ACCESS_TOKEN } = process.env;

const addShowToUser = async (req, res) => {
    const { showName, userId, posterPath } = req.body;

    if (!showName || !userId) {
        return res.status(400).json({ error: "showName and userId are required" });
    }

    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db("tv_tracker");
        const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(showName)}`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
            },
        };

        const response = await fetch(url, options);
        const showData = await response.json();

        if (!showData || !showData.results || showData.results.length === 0) {
            return res.status(404).json({ error: "Show not found" });
        }
        const show = showData.results[0];

        const showEntry = {
            id: show.id,
            name: show.name,
            poster_path: posterPath,
            status: "to-watch",
            details: [],
        };
       const resault = await db.collection("users").updateOne(
            { id: userId },
            { $push: { shows: showEntry } }
        );
console.log(resault)
        res.status(200).json({ message: "Show added to user", show: showEntry });
    } catch (err) {
        console.error("Error adding show to user:", err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await client.close();
    }
};

module.exports = addShowToUser;
