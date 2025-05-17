const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
console.log("✅ Loaded environment variables:", process.env.DATABASE_URL); // Debugging line

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Root route to prevent "Cannot GET /" error
app.get("/", (req, res) => {
    res.send("Welcome to the Job Board API!");
});

// ✅ Connect to MongoDB Atlas (Using Environment Variable)
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(error => console.error("❌ MongoDB connection error:", error));

// ✅ Define Job Schema & Model
const jobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    type: String,
    salary: Number,
    experience: Number
});
const Job = mongoose.model("Job", jobSchema);

// ✅ Fetch all job listings from MongoDB
app.get("/jobs", async (req, res) => {
    try {
        const jobs = await Job.find();
        console.log("✅ Jobs retrieved from database:", jobs);  // 
        res.json(jobs);
    } catch (error) {
        console.error("❌ Error fetching jobs:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// ✅ Add new job posting (for employers)
app.post("/jobs", async (req, res) => {
    try {
        const { title, company, location, type, salary, experience } = req.body;
        const newJob = new Job({ title, company, location, type, salary, experience });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ error: "Failed to add job" });
    }
});

// ✅ Delete a job posting (for admins)
app.delete("/jobs/:id", async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete job" });
    }
});

// ✅ Start the Express server (Using Environment Variable)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));