const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const updateShowStatus = async (req, res) => {
    const { userId, showId, newStatus } = req.body;

    if (!userId || !showId || !newStatus) {
        return res.status(400).json({ error: "userId, showId, and newStatus are required" });
    }

    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db("tv_tracker");
        const user = await db.collection("users").findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const showIndex = user.shows.findIndex((show) => show.id === showId);
        if (showIndex === -1) {
            return res.status(404).json({ error: "Show not found in user's watchlist" });
        }
        user.shows[showIndex].status = newStatus;
        
        await db.collection("users").updateOne(
            { id: userId },
            { $set: { shows: user.shows } }
        );

        res.status(200).json({ message: "Show status updated successfully" });
    } catch (err) {
        console.error("Error updating show status:", err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await client.close();
    }
};

module.exports = updateShowStatus;
