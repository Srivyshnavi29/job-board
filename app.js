// ✅ Fetch jobs dynamically from MongoDB instead of using `jobs.js`
async function fetchJobs() {
    try {
        const response = await fetch("http://localhost:5000/jobs");
        const jobs = await response.json();
        displayJobs(jobs); // Show the fetched jobs
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}

const jobsContainer = document.getElementById("jobs-container");
const locationFilter = document.getElementById("location-filter");
const jobTypeFilter = document.getElementById("job-type-filter");
const sortFilter = document.getElementById("sort-filter");
const userStatus = document.getElementById("user-status");
const logoutBtn = document.getElementById("logout-btn");

let users = []; // Store registered users
let loggedInUser = null; // Track current user

// Populate location dropdown dynamically
function populateLocationFilter(jobs) {
    const uniqueLocations = [...new Set(jobs.map(job => job.location))];
    locationFilter.innerHTML = '<option value="">All Locations</option>';
    uniqueLocations.forEach(location => {
        const option = document.createElement("option");
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}

// Populate job type dropdown dynamically
function populateJobTypeFilter(jobs) {
    const uniqueJobTypes = [...new Set(jobs.map(job => job.type))];
    jobTypeFilter.innerHTML = '<option value="">All Job Types</option>';
    uniqueJobTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        jobTypeFilter.appendChild(option);
    });
}

// Display jobs dynamically
function displayJobs(jobs) {
    jobsContainer.innerHTML = ""; // Clear previous results

    jobs.forEach((job, index) => {
        const jobElement = document.createElement("div");
        jobElement.classList.add("job");

        jobElement.innerHTML = `
            <h3>${job.title}</h3>
            <p>Company: ${job.company}</p>
            <p>Location: ${job.location}</p>
            <p>Job Type: ${job.type || "Not specified"}</p>
            <p>Salary: $${job.salary.toLocaleString()}</p>
            <p>Experience: ${job.experience} years</p>
            <button onclick="applyJob('${job.title}')">Apply Now</button>
            ${loggedInUser ? `<button onclick="deleteJob(${index})">Delete Job</button>` : ""}
        `;

        jobsContainer.appendChild(jobElement);
    });

    // Populate filters with data from jobs
    populateLocationFilter(jobs);
    populateJobTypeFilter(jobs);
}

// 🔎 Filter Jobs Based on Search & Dropdowns
function filterJobs() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const selectedLocation = locationFilter.value;
    const selectedJobType = jobTypeFilter.value;

    fetch("http://localhost:5000/jobs")
        .then(response => response.json())
        .then(jobs => {
            const filteredJobs = jobs.filter(job =>
                (searchTerm === "" || job.title.toLowerCase().includes(searchTerm) || job.company.toLowerCase().includes(searchTerm)) &&
                (selectedLocation === "" || job.location === selectedLocation) &&
                (selectedJobType === "" || job.type === selectedJobType)
            );
            displayJobs(filteredJobs);
        });
}

// 🔥 Sorting Jobs by Salary, Experience, or Company Name
function sortJobs() {
    const sortCriteria = sortFilter.value;

    fetch("http://localhost:5000/jobs")
        .then(response => response.json())
        .then(jobs => {
            let sortedJobs = [...jobs];

            switch (sortCriteria) {
                case "salary-high":
                    sortedJobs.sort((a, b) => b.salary - a.salary);
                    break;
                case "salary-low":
                    sortedJobs.sort((a, b) => a.salary - b.salary);
                    break;
                case "experience-high":
                    sortedJobs.sort((a, b) => b.experience - a.experience);
                    break;
                case "experience-low":
                    sortedJobs.sort((a, b) => a.experience - b.experience);
                    break;
                case "company":
                    sortedJobs.sort((a, b) => a.company.localeCompare(b.company));
                    break;
                default:
                    break;
            }

            displayJobs(sortedJobs);
        });
}

// 🔐 User Authentication (Signup, Login & Logout)
function signup() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        users.push({ username, password });
        alert("Signup successful! Please log in.");
    } else {
        alert("Please enter a valid username and password.");
    }
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        loggedInUser = user;
        userStatus.innerText = `Logged in as ${username}`;
        logoutBtn.style.display = "block";
        alert("Login successful!");
    } else {
        alert("Invalid credentials. Please try again.");
    }
}

function logout() {
    loggedInUser = null;
    userStatus.innerText = "Not logged in";
    logoutBtn.style.display = "none";
    alert("Logged out successfully.");
}

// 📝 Apply for a Job (Only Available to Logged-In Users)
function applyJob(jobTitle) {
    if (!loggedInUser) {
        alert("Please log in to apply for jobs.");
        return;
    }

    alert(`Application submitted for ${jobTitle}. Best of luck!`);
}

// ❌ Delete a Job (Only Available to Logged-In Users)
function deleteJob(index) {
    if (!loggedInUser) {
        alert("Please log in to manage job listings.");
        return;
    }
    
    fetch("http://localhost:5000/jobs")
        .then(response => response.json())
        .then(jobs => {
            jobs.splice(index, 1);
            displayJobs(jobs);
            alert("Job deleted successfully!");
        });
}

// ✅ Fetch job listings on page load
fetchJobs();