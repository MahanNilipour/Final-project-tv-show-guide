const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const updateShowProgress = async (req, res) => {
    const { userId, showId, seasonName, episode } = req.body;

    if (!userId || !showId || !seasonName || episode === undefined) {
        return res.status(400).json({
            error: "userId, showId, seasonName, and episode are required",
        });
    }

    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db("tv_tracker");

        const user = await db.collection("users").findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userShows = user.shows || [];
        const targetShowIndex = userShows.findIndex((show) => show.id === showId);
        if (targetShowIndex === -1) {
            return res.status(404).json({ error: "Show not found in user's list" });
        }

        const currentDetails = userShows[targetShowIndex].details || [];

        let updatedDetails;
        if (episode === "completed") {
            updatedDetails = [...currentDetails, { season: seasonName, episode }];
        } else if (episode === null) {
            updatedDetails = currentDetails.filter(
                (seasonProgress) => seasonProgress.season !== seasonName
            );
        } else {
            updatedDetails = currentDetails;
        }

        const updateResult = await db.collection("users").updateOne(
            { id: userId, "shows.id": showId },
            { $set: { "shows.$.details": updatedDetails } }
        );
        if (updateResult.modifiedCount === 0) {
            return res.status(500).json({ error: "Failed to update show details" });
        }
        res.status(200).json({ message: "Show progress updated successfully" });
    } catch (err) {
        console.error("Error updating show progress:", err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await client.close();
    }
};

module.exports = updateShowProgress;
