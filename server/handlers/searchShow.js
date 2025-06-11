require("dotenv").config();
const { TMDB_ACCESS_TOKEN } = process.env;

const searchShow = async (req, res) => {
    const { showName } = req.body; 

    if (!showName) {
        return res.status(400).json({ error: "showName is required" });
    }

    try {
        console.log(`Searching for: ${showName}`);
        const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(showName)}`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
            },
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            console.log(`Error from TMDB API: ${response.status}`);
            const errorData = await response.json();
            console.log("Error details:", errorData);
            return res.status(response.status).json({ error: errorData.status_message || "Error from TMDB API" });
        }
        const showData = await response.json();
        if (!showData.results || showData.results.length === 0) {
            console.log("No results found for the search.");
            return res.status(404).json({ error: "Show not found" });
        }
        console.log("Found shows:", showData.results.length);
        res.status(200).json(showData.results);
    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports= searchShow