// server.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
// Use Vercel's provided port or default to 3000 for local development
const PORT = process.env.PORT || 3000; 

// --- API Information ---
// KEEP YOUR API KEY SECURE ON THE SERVER SIDE
const API_KEY = "25bdff0de7167fca0205fbc4009023afdf21c163f925937b4948517b098e89b9"; 
const API_BASE_URL = "https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api";
const ENDPOINT = "/ytapi";

// Enable CORS
app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());

// ======================================================================
// 1. API Proxy Route (Handles Download Requests)
// ======================================================================
app.post('/api/download', async (req, res) => {
    const { url, fo, qu } = req.body;

    if (!url || !fo || !qu) {
        return res.status(400).json({ error: "Missing required parameters: url, fo, or qu" });
    }

    const params = {
        url: url,
        fo: fo,
        qu: qu
    };

    try {
        // Call the external download API using the stored API_KEY
        const response = await axios.get(`${API_BASE_URL}${ENDPOINT}`, {
            params: params,
            headers: {
                'Authorization': `Bearer ${API_KEY}`, 
            }
        });

        // Send the external API's response back to the client
        res.json(response.data);
    } catch (error) {
        console.error("External API Call Failed:", error.response?.data || error.message);
        res.status(500).json({ 
            error: "Failed to process download request",
            details: error.response?.data?.message || "Internal server error"
        });
    }
});


// ======================================================================
// 2. Root Route (Serves the HTML/Frontend)
// This fixes the "Cannot GET /" issue on Vercel
// ======================================================================

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AK YT MP3 & MP4 DL</title>
<link rel="icon" href="https://raw.githubusercontent.com/mybotmybot15-png/Test-web/main/20250912_210649.png" type="image/jpeg">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<style>
  /* --- CSS Styles --- */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }
  
  .card {
    background: rgba(30, 41, 59, 0.8);
    backdrop-filter: blur(10px);
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 700px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    margin-bottom: 25px;
  }
  
  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #4f46e5, #ec4899, #4f46e5);
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
  }
  
  h1 {
    margin-bottom: 20px;
    text-align: center;
    font-size: 28px;
    background: linear-gradient(90deg, #4f46e5, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .form {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  input {
    flex: 2;
    padding: 15px;
    border-radius: 12px;
    border: 2px solid #334155;
    background: #1e293b;
    color: #fff;
    font-size: 16px;
    transition: all 0.3s ease;
  }
  
  .btn-group-item {
    flex: 1; 
    padding: 15px 25px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(90deg, #4f46e5, #6366f1);
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .result {
    margin-top: 25px;
    display: none;
    text-align: center;
    animation: fadeIn 0.4s ease forwards;
  }
  
  .thumb {
    width: 100%;
    max-width: 320px;
    height: 180px;
    overflow: hidden;
    border-radius: 12px;
    margin: 0 auto 15px;
  }
  
  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  h2 {
    font-size: 20px;
    margin-bottom: 15px;
    line-height: 1.4;
  }
  
  a.download {
    display: inline-block;
    padding: 12px 25px;
    background: linear-gradient(90deg, #22c55e, #16a34a);
    color: #fff;
    border-radius: 12px;
    text-decoration: none;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .loading {
    display: none;
    text-align: center;
    margin: 20px 0;
  }
  
  .loading-ring {
    display: inline-block;
    width: 64px;
    height: 64px;
  }
  
  .loading-ring:after {
    content: " ";
    display: block;
    width: 50px;
    height: 50px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #4f46e5;
    border-color: #4f46e5 transparent #4f46e5 transparent;
    animation: loading-ring 1.2s linear infinite;
  }

  /* Specific styles for MP4 button */
  #fetchMp4Btn {
    background: linear-gradient(90deg, #10b981, #059669);
  }

  .progress-container {
    width: 100%;
    height: 8px;
    background: #334155;
    border-radius: 4px;
    margin: 15px 0;
    overflow: hidden;
    display: none;
  }
  
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #4f46e5, #ec4899);
    border-radius: 4px;
    width: 0%;
    transition: width 0.3s ease;
  }
  
  .status-text {
    font-size: 14px;
    color: #94a3b8;
    margin-top: 10px;
  }

  .error-message {
    color: #f87171;
    text-align: center;
    margin-top: 15px;
    font-weight: bold;
  }

  @keyframes loading-ring {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: none; }
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @media (max-width: 600px) {
    .form { flex-direction: column; }
    .card { padding: 20px; }
  }
</style>
</head>
<body>
<div class="card">
  <h1><i class="fab fa-youtube"></i> AK YT MP3 & MP4 DL</h1>
  <div class="form">
    <input id="videoUrl" placeholder="Enter YouTube URL" />
    <button id="fetchMp3Btn" class="btn-group-item">Get MP3</button>
    <button id="fetchMp4Btn" class="btn-group-item btn-mp4">Get MP4</button>
  </div>
  
  <div class="progress-container" id="progressContainer">
    <div class="progress-bar" id="progressBar"></div>
  </div>
  <div class="status-text" id="statusText"></div>
  
  <div id="loading" class="loading">
    <div class="loading-ring"></div>
    <p>Processing your request...</p>
  </div>
  
  <div id="result" class="result">
    <div class="thumb"><img id="thumb" src="" alt="thumbnail"></div>
    <h2 id="title"></h2>
    
    <div id="downloadOptions" style="display:flex; justify-content:center; gap:15px; flex-wrap:wrap; margin-top:15px;">
    </div>
  </div>
  
  <div id="errorMessage" class="error-message"></div>
</div>

<footer>
  <div class="footer-icons">
    </div>
  <div>AK CREATION © 2025</div>
</footer>

<script>
  // --- Client-Side JavaScript ---
  // The PROXY_URL is set to a relative path, which works both locally (localhost:3000/api/download) 
  // and on Vercel (your-domain.vercel.app/api/download).
  const PROXY_URL = '/api/download'; 

  const videoUrlInput = document.getElementById('videoUrl');
  const fetchMp3Btn = document.getElementById('fetchMp3Btn');
  const fetchMp4Btn = document.getElementById('fetchMp4Btn');
  const loadingDiv = document.getElementById('loading');
  const resultDiv = document.getElementById('result');
  const titleElement = document.getElementById('title');
  const thumbImage = document.getElementById('thumb');
  const downloadOptionsDiv = document.getElementById('downloadOptions');
  const errorMessageDiv = document.getElementById('errorMessage');

  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const statusText = document.getElementById('statusText');
  
  function getYoutubeId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  function resetUI() {
    loadingDiv.style.display = 'none';
    resultDiv.style.display = 'none';
    errorMessageDiv.textContent = '';
    downloadOptionsDiv.innerHTML = '';
    progressContainer.style.display = 'none';
    statusText.textContent = '';
  }

  async function downloadVideo(fileType, fo, qu) {
    resetUI();
    const url = videoUrlInput.value.trim();
    if (!url) {
      errorMessageDiv.textContent = "Please enter a YouTube URL.";
      return;
    }

    const videoId = getYoutubeId(url);
    if (!videoId) {
      errorMessageDiv.textContent = "Invalid YouTube URL.";
      return;
    }

    loadingDiv.style.display = 'block';
    statusText.textContent = \`Fetching \${fileType} data...\`;
    progressContainer.style.display = 'block';
    progressBar.style.width = '20%';

    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url, fo: fo, qu: qu }),
      });

      progressBar.style.width = '50%';
      const data = await response.json();
      progressBar.style.width = '70%';

      if (!response.ok || data.error) {
        throw new Error(data.details || data.error || \`Failed to get \${fileType} link. Server response was: \${response.statusText}\`);
      }
      
      const downloadUrl = data.downloadData.url;
      const downloadFormat = data.format;
      
      const videoTitle = data.title || \`YouTube Download (\${downloadFormat})\`; 
      const thumbnailUrl = \`http://img.youtube.com/vi/\${videoId}/hqdefault.jpg\`; // Use videoId for thumbnail
      
      titleElement.textContent = videoTitle;
      thumbImage.src = thumbnailUrl;
      
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = \`\${videoTitle.replace(/[^a-z0-9]/gi, '_')}.\${fileType.toLowerCase() === 'mp3' ? 'mp3' : 'mp4'}\`;
      downloadLink.classList.add('download');
      downloadLink.innerHTML = \`<i class="fas fa-download"></i> Download \${fileType} (\${downloadFormat})\`;
      
      downloadOptionsDiv.innerHTML = '';
      downloadOptionsDiv.appendChild(downloadLink);
      
      statusText.textContent = \`\${fileType} link ready!\`;
      progressBar.style.width = '100%';
      loadingDiv.style.display = 'none';
      resultDiv.style.display = 'block';

    } catch (error) {
      console.error("Download Error:", error);
      resetUI();
      errorMessageDiv.textContent = \`Download failed. Please try again or check the URL. Details: \${error.message}\`;
    }
  }

  fetchMp3Btn.addEventListener('click', () => {
    // MP3 (Audio) parameters
    downloadVideo('MP3', 1, 144); 
  });

  fetchMp4Btn.addEventListener('click', () => {
    // MP4 (Video) parameters
    downloadVideo('MP4', 2, 1080);
  });

</script>
</body>
</html>
`;

// Route to serve the HTML content to the browser
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
});

// ======================================================================
// Server Startup
// ======================================================================
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Front-end is accessible at the root URL (/)`);
});
