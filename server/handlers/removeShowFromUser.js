const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const removeShowFromUser = async (req, res) => {
    const { showId, userId } = req.body;

    if (!showId || !userId) {
        return res.status(400).json({ error: "showId and userId are required" });
    }
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("tv_tracker");

        const result = await db.collection("users").updateOne(
            { id: userId },
            { $pull: { shows: { id: parseInt(showId) } } } 
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Show not found in user's list" });
        }
        res.status(200).json({ message: "Show removed from watchlist" });
    } catch (err) {
        console.error("Error removing show:", err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await client.close();
    }
};

module.exports = removeShowFromUser;
