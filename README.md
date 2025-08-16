# CropConnect 🌾

A multi-lingual, AI-powered web application designed to provide farmers with real-time agricultural market prices and actionable intelligence, empowering them to get the best value for their crops.

---

## 🎯 The Problem Statement

Small farmers often sell crops at unfair prices due to a lack of real-time market rate awareness and poor negotiation power. They lack access to simple, centralized, and intelligent data that can help them decide when and where to sell their produce for the best possible price.

## 💡 Our Solution & Key Features

CropConnect tackles this problem by providing a simple, accessible, and powerful platform that turns raw government data into actionable insights for farmers.

*   **Real-Time Price Data:** Fetches live mandi (market) prices directly from the official **Data.gov.in** API, ensuring the information is accurate and trustworthy.

*   **AI-Powered Market Summary:** Utilizes the **Google Gemini AI** to analyze the day's market data and generate a simple, 3-bullet point summary. This gives farmers a quick, high-level overview of market trends without needing to analyze raw numbers.

*   **Full Multi-Language Support:** The entire user interface, including the AI-generated reports, is available in **English, Hindi (हिन्दी), and Malayalam (മലയാളം)**, making the tool accessible to a wider range of farmers.

*   **Advanced Filtering & Sorting:** Farmers can filter the results by State and dynamically sort the data by market name, minimum price, maximum price, or modal price to easily identify the best opportunities.

*   **Interactive Charts & Graphs:** Powered by **Chart.js**, the application displays a clear bar chart comparing the Min, Max, and Modal prices in the top markets, offering a quick visual understanding of price variations.

*   **Responsive & Mobile-First Design:** Built to work flawlessly on low-cost smartphones, ensuring the tool is practical for farmers to use in the field or at the mandi.

## 👨‍🌾 Team Members

*   Gautham Binoy
*   Athul M S
*   Hannath M A

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript, Chart.js
*   **Backend:** Node.js, Express.js
*   **AI Engine:** Google Gemini API (`gemini-1.5-flash`)
*   **Data Source:** Government of India's Data.gov.in API

---

## 🚀 Setup and Installation Instructions

To run this project locally, you will need to set up the backend server and then open the frontend files.

### Backend Setup

1.  **Navigate to the backend folder:**
    ```bash
    cd cropconnect-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:** Create a new file named `.env` in the `cropconnect-backend` folder. Paste the following content into it and replace the placeholders with your actual API keys.

    ```
    # .env file
    DATA_GOV_API_KEY=YOUR_DATAGOV_API_KEY_HERE
    GOOGLE_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY_HERE
    ```
    **Note:** The `.env` file is included in `.gitignore` and should not be committed to GitHub.

4.  **Start the server:**
    ```bash
    node index.js
    ```
    The server will start and be running at `http://localhost:3001`.

### Frontend Setup

1.  **Prerequisite:** Ensure the backend server is running first.

2.  **No installation is needed!** The frontend is built with static HTML, CSS, and JavaScript.

3.  **Open the main page:** Navigate to the frontend folder and open the `index.html` file directly in your web browser (e.g., Chrome, Firefox).

4.  The application is now running and will communicate with your local backend server.

## ⚠️ Important Note on API Rate Limits

This project uses the free tier of the Google Gemini API to generate AI-powered market summaries. The free tier has a daily request limit (currently around 50 requests/day).

If the "AI Market Report" section shows an error or fails to load, it is likely because this daily limit has been reached due to testing or high usage. The feature will automatically start working again once the daily quota resets. The core functionality of fetching and displaying market prices from Data.gov.in will not be affected.