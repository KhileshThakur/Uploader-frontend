const API_URL = "http://localhost:5000/api/media";
const TOKEN = localStorage.getItem("token");

let selectedFile = null;

// Handle File Selection
function handleFileSelect(event) {
    selectedFile = event.target.files[0];
    document.querySelector(".upload-box").textContent = selectedFile.name;
}

// Upload File
async function uploadFile() {
    if (!selectedFile) {
        alert("Please select a file first!");
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const progressBar = document.getElementById("progress");
    progressBar.style.width = "0%";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/upload`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${TOKEN}`);

    // Track Upload Progress
    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            let percent = (event.loaded / event.total) * 100;
            progressBar.style.width = percent + "%";
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("File uploaded successfully!");
            loadFiles();
        } else {
            alert("Error uploading file");
        }
    };

    xhr.send(formData);
}

// Fetch and Display Uploaded Files
async function loadFiles() {
    try {
        const response = await fetch(`${API_URL}/files`, {
            headers: { "Authorization": `Bearer ${TOKEN}` }
        });

        if (!response.ok) {
            alert("Failed to fetch files");
            return;
        }

        const files = await response.json();
        const fileContainer = document.getElementById("uploadedFiles");
        fileContainer.innerHTML = "";

        if (files.length === 0) {
            fileContainer.innerHTML = "<p>No files uploaded yet.</p>";
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>File URL</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        files.forEach(file => {
            tableHTML += `
                <tr>
                    <td><a href="${file.url}" target="_blank">${file.url}</a></td>
                    <td><button class="copy-btn" onclick="copyToClipboard('${file.url}')">📋</button></td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        fileContainer.innerHTML = tableHTML;
    } catch (error) {
        console.error("Error fetching files:", error);
    }
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    }).catch(err => {
        console.error("Copy failed:", err);
    });
}

// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// Load files on page load
loadFiles();
