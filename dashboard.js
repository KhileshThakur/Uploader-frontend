const API_URL = "http://localhost:5000/api/media";
let selectedFile = null;

// Handle file selection
function handleFileSelect(event) {
    selectedFile = event.target.files[0];
    document.querySelector(".upload-box").textContent = selectedFile.name;
}

// Upload file
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

    // Track upload progress
    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            let percent = (event.loaded / event.total) * 100;
            progressBar.style.width = percent + "%";
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("File uploaded successfully!");
            loadFiles(); // Refresh file list
        } else {
            alert("Error uploading file");
        }
    };

    xhr.send(formData);
}

// Fetch uploaded files
async function loadFiles() {
    const response = await fetch(`${API_URL}/files`);
    const files = await response.json();

    const fileContainer = document.getElementById("uploadedFiles");
    fileContainer.innerHTML = "";

    files.forEach(file => {
        const div = document.createElement("div");
        div.innerHTML = `<a href="${file.url}" target="_blank">${file.url}</a>`;
        fileContainer.appendChild(div);
    });
}

// Load files on page load
loadFiles();
