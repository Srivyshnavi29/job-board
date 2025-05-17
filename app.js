import fetchJobs from "./jobs.js"; // Import fetchJobs function

const API_URL = "http://localhost:5000/jobs"; // Change to live URL after deployment

const jobsContainer = document.getElementById("jobs-container");
const locationFilter = document.getElementById("location-filter");
const jobTypeFilter = document.getElementById("job-type-filter");
const sortFilter = document.getElementById("sort-filter");
const userStatus = document.getElementById("user-status");
const logoutBtn = document.getElementById("logout-btn");
const searchInput = document.getElementById("search");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");

let loggedInUser = null; // Track current user

// ✅ Attach event listeners
signupBtn.addEventListener("click", signup);
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
searchInput.addEventListener("input", filterJobs);
sortFilter.addEventListener("change", sortJobs);

// ✅ Load existing user from local storage
loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
updateUserStatus();

// ✅ Populate dropdown filters dynamically
function populateFilters(jobs) {
    const uniqueLocations = [...new Set(jobs.map(job => job.location))];
    const uniqueJobTypes = [...new Set(jobs.map(job => job.type))];

    locationFilter.innerHTML = '<option value="">All Locations</option>';
    jobTypeFilter.innerHTML = '<option value="">All Job Types</option>';

    uniqueLocations.forEach(location => {
        locationFilter.innerHTML += `<option value="${location}">${location}</option>`;
    });

    uniqueJobTypes.forEach(type => {
        jobTypeFilter.innerHTML += `<option value="${type}">${type}</option>`;
    });
}

// ✅ Display jobs dynamically
function displayJobs(jobs) {
    jobsContainer.innerHTML = ""; // Clear previous results

    jobs.forEach((job) => {
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
            ${loggedInUser ? `<button onclick="deleteJob('${job._id}')">Delete Job</button>` : ""}
        `;

        jobsContainer.appendChild(jobElement);
    });

    populateFilters(jobs);
}

// 🔎 Filter Jobs Based on Search & Dropdowns
function filterJobs() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedLocation = locationFilter.value;
    const selectedJobType = jobTypeFilter.value;

    fetch(API_URL)
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

    fetch(API_URL)
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
            }

            displayJobs(sortedJobs);
        });
}

// 🔐 Signup Function (Stores in Local Storage)
function signup() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        localStorage.setItem(username, JSON.stringify({ username, password }));
        alert("✅ Signup successful! Please log in.");
    } else {
        alert("❌ Enter a valid username and password.");
    }
}

// 🔐 Login Function
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const storedUser = JSON.parse(localStorage.getItem(username));

    if (storedUser && storedUser.password === password) {
        loggedInUser = storedUser;
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        updateUserStatus();
        alert("✅ Login successful!");
    } else {
        alert("❌ Invalid credentials.");
    }
}

// 🔐 Logout Function
function logout() {
    localStorage.removeItem("loggedInUser");
    loggedInUser = null;
    updateUserStatus();
    alert("✅ Logged out successfully.");
}

// ✅ Update UI for Logged-In User
function updateUserStatus() {
    if (loggedInUser) {
        userStatus.innerText = `✅ Logged in as ${loggedInUser.username}`;
        logoutBtn.style.display = "block";
    } else {
        userStatus.innerText = "Not logged in";
        logoutBtn.style.display = "none";
    }
}

// 📝 Apply for a Job (Only Available to Logged-In Users)
function applyJob(jobTitle) {
    if (!loggedInUser) {
        alert("❌ Please log in to apply for jobs.");
        return;
    }

    alert(`✅ Application submitted for ${jobTitle}. Best of luck!`);
}

// ❌ Delete a Job (Only Available to Logged-In Users)
function deleteJob(jobId) {
    if (!loggedInUser) {
        alert("❌ Please log in to manage job listings.");
        return;
    }

    fetch(`${API_URL}/${jobId}`, { method: "DELETE" })
        .then(() => {
            fetchJobs(); // Refresh job listings
            alert("✅ Job deleted successfully!");
        });
}

// ✅ Fetch job listings on page load
fetchJobs();