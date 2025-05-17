const API_URL = "http://localhost:5000/jobs"; // Change this to your live backend URL when deployed

// ✅ Fetch jobs dynamically from MongoDB
async function fetchJobs() {
    try {
        const response = await fetch(API_URL);
        const jobs = await response.json();
        displayJobs(jobs); // Show the fetched jobs
    } catch (error) {
        console.error("❌ Error fetching jobs:", error);
    }
}

export default fetchJobs;