const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const app = express();
app.use(express.json());

const signup = async (req, res) => {
const { email, name } = req.body;

if (!email || !name) {
    return res.status(400).json({ error: "Both email and name are required" });
}

const client = new MongoClient(MONGO_URI);

try {
    await client.connect();
    const db = client.db("tv_tracker");
    const collection = db.collection("users");

    const user = {
        id: uuidv4(),
        email,
        name,
        shows:[],
    };

    await collection.insertOne(user);
    res.status(201).json({ message: "User signed up successfully", user });
    } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Internal server error" });
    } finally {
    await client.close();
}
};

module.exports = signup