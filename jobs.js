// ✅ Fetch jobs dynamically from your backend
async function fetchJobs() {
    try {
        const response = await fetch("http://localhost:5000/jobs");
        const jobs = await response.json();
        return jobs; // Return the fetched job list
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return []; // Return empty list on error
    }
}

export default fetchJobs;