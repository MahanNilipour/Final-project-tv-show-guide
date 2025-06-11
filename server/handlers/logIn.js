const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const logIn = async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        return res.status(400).json({ error: "Both email and name are required" });
    }
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("tv_tracker");
        const collection = db.collection("users");
        const user = await collection.findOne({ email, name });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({user });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await client.close();
    }
};

module.exports = logIn;
