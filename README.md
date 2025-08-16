<div align="center">
  <br />
  <h1>🌾 CropConnect 🌾</h1>
  <br />
</div>

> A multi-lingual, AI-powered web application designed to provide farmers with real-time agricultural market prices and actionable intelligence, empowering them to get the best value for their crops.

<div align="center">

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B9?style=for-the-badge&logo=google-gemini&logoColor=white)

</div>

---

<p align="center">
  <img src="docs/assets/demo.gif" alt="CropConnect Application Demo GIF" width="80%">
</p>

---

## 🚀 Live Demo

**➡️ [VIEW THE LIVE APPLICATION HERE](https://gautham-binoy.github.io/Cropconnect/)** ⬅️

*(Note: The AI feature is subject to a free-tier daily rate limit. See the note at the bottom.)*

---

## 🎯 The Problem

Small farmers often sell crops at unfair prices due to a lack of real-time market rate awareness and poor negotiation power. They lack access to simple, centralized, and intelligent data that can help them decide **when** and **where** to sell their produce for the best possible price.

## 💡 Our Solution

CropConnect tackles this problem by providing a simple, accessible, and powerful platform that turns raw government data into actionable insights for farmers. Our key features directly address their needs:

*   **📈 Real-Time Price Data:** Fetches live mandi (market) prices directly from the official **Data.gov.in** API, ensuring the information is accurate and trustworthy.

*   **🤖 AI-Powered Market Summary:** Utilizes the **Google Gemini AI** to analyze the day's market data and generate a simple, 3-bullet point summary. This gives farmers a quick, high-level overview of market trends without needing to analyze raw numbers.

*   **🌍 Full Multi-Language Support:** The entire user interface, including the AI-generated reports, is available in **English, Hindi (हिन्दी), and Malayalam (മലയാളം)**, making the tool accessible to a wider range of farmers.

*   **📊 Advanced Filtering & Sorting:** Farmers can filter results by State and dynamically sort data by market name, minimum price, maximum price, or modal price to easily identify the best opportunities.

*   **📱 Responsive & Mobile-First Design:** Built to work flawlessly on low-cost smartphones, ensuring the tool is practical for farmers to use in the field or at the mandi.

---

## 🛠️ Tech Stack

| Category      | Technology                                    |
| ------------- | --------------------------------------------- |
| **Frontend**  | HTML5, CSS3, Vanilla JavaScript, Chart.js     |
| **Backend**   | Node.js, Express.js                           |
| **AI Engine** | Google Gemini API (`gemini-1.5-flash`)          |
| **Data Source** | Government of India's Data.gov.in API         |

---

## 🌐 Deployment & Live Setup

This project uses a decoupled, hybrid deployment model, which is a standard practice for modern web applications. The frontend and backend are hosted separately for optimal performance and scalability.

### Backend (Live on Render)
*   The Node.js/Express server is deployed as a **Web Service on Render.com**, chosen for its ability to run servers 24/7 and its generous free tier.
*   It is deployed from the `/backend` directory of this repository.
*   This server handles all the logic for fetching data from the government API and generating AI summaries with the Google Gemini API.

### Frontend (Live on GitHub Pages)
*   The static user interface is hosted using **GitHub Pages**, chosen for its seamless integration and robust, free hosting.
*   It is deployed from the `/docs` directory of this repository.
*   The live frontend communicates with the live backend on Render to fetch all its data.

### Architecture Flow
[ User ] --> [ GitHub Pages (Frontend) ] --> [ Render.com (Backend API) ] --+--> [ data.gov.in ]
|
+--> [ Google Gemini AI ]



---

## ⚙️ Local Setup and Installation

To run this project locally, you will need to set up the backend server and then open the frontend files.

### 1. Backend Setup

-   Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
-   Install dependencies:
    ```bash
    npm install
    ```
-   Create an environment file named `.env` in the `backend` folder. Paste the following into it and replace the placeholders with your actual API keys.
    ```
    # .env file
    DATA_GOV_API_KEY=YOUR_DATAGOV_API_KEY_HERE
    GOOGLE_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY_HERE
    ```
-   Start the server:
    ```bash
    node index.js
    ```
    The server will now be running at `http://localhost:3001`.

### 2. Frontend Setup

-   **Prerequisite:** Ensure the backend server is running first.
-   **No installation is needed!**
-   Navigate to the `docs` (or `frontend`) folder and open the `index.html` file directly in your web browser.

---

## 👨‍🌾 The Team

*   Gautham Binoy
*   Athul M S
*   Hannath M A

---

## ⚠️ Important Note on API Rate Limits

This project uses the free tier of the Google Gemini API. The free tier has a daily request limit. If the "AI Market Report" shows an error, it is likely because this daily limit has been reached. The core price-fetching functionality will not be affected.