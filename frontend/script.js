// script.js (SPECIAL DEBUGGING VERSION)

document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: Page loaded. Initializing scripts.");

    // --- CONFIGURATION ---
    //localhost 
    //const BACKEND_URL = 'http://localhost:3001';
    // Live Render URL
    const BACKEND_URL = 'https://cropconnect-backend.onrender.com'; 
    // --- DOM ELEMENT REFERENCES ---
    const searchTitle = document.getElementById('search-title');
    const stateFilter = document.getElementById('state-filter');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const chartContainer = document.getElementById('chart-container');
    const tableContainer = document.getElementById('table-container');
    const priceTableBody = document.getElementById('priceTableBody');
    const chartCanvas = document.getElementById('priceChart');
    const aiSummaryContainer = document.getElementById('ai-summary-container');
    const aiSummaryContent = document.getElementById('ai-summary-content');
    
    // --- STATE MANAGEMENT ---
    let priceChart = null;
    let allMarketData = [];
    let currentSort = { key: 'market', order: 'asc' };

    // --- MAIN INITIALIZATION FUNCTION ---
    const initializePage = () => {
        console.log("DEBUG: Starting initializePage function.");
        const urlParams = new URLSearchParams(window.location.search);
        const commodity = urlParams.get('commodity');

        if (!commodity) {
            showError("No crop specified. Please go back and search.");
            return;
        }
        
        const displayCommodity = commodity.charAt(0).toUpperCase() + commodity.slice(1);
        document.title = `CropConnect - ${displayCommodity} Prices`;
        
        const currentState = stateFilter.value;
        fetchDataAndDisplay(commodity, currentState);
        fetchAndDisplaySummary(commodity, currentState);
    };

    // --- AI SUMMARY FUNCTION ---
    const fetchAndDisplaySummary = async (commodity, state = "") => {
        // This function is working, so we will not add logs here.
        aiSummaryContainer.classList.remove('hidden');
        aiSummaryContent.innerHTML = '<div class="summary-loader"></div>';
        const currentLang = localStorage.getItem('language') || 'en';
        try {
            let apiUrl = `${BACKEND_URL}/api/summary?commodity=${commodity}&date=${getFormattedDate(new Date(), 1)}&lang=${currentLang}`;
            if (state) apiUrl += `&state=${state}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Could not get AI summary.");
            const data = await response.json();
            const formattedSummary = '<ul><li>' + data.summary.replace(/\n/g, '<br>').replace(/(\*|\-)\s/g, '</li><li>') + '</li></ul>';
            aiSummaryContent.innerHTML = formattedSummary;
        } catch (error) {
            console.error("AI Summary Error:", error);
            aiSummaryContent.innerHTML = "AI summary could not be generated at this time.";
        }
    };
    
    // --- MAIN DATA FETCHING FUNCTION (WITH DEBUG LOGS) ---
    const fetchDataAndDisplay = async (commodity, state = "") => {
        console.log("DEBUG #1: Starting fetchDataAndDisplay...");
        showLoading();
        try {
            const date = getFormattedDate(new Date(), 1);
            let apiUrl = `${BACKEND_URL}/api/prices?commodity=${commodity}&date=${date}`;
            if (state) apiUrl += `&state=${state}`;
            
            const response = await fetch(apiUrl);
            console.log("DEBUG #2: Fetch response received from backend.", response);
            if (!response.ok) throw new Error("Could not fetch data from the server. Is the backend running?");

            const data = await response.json();
            console.log("DEBUG #3: Parsed JSON data from backend:", data);
            
            populateStateFilter(data.records);
            console.log("DEBUG #4: Populated state filter.");

            allMarketData = processPriceData(data.records);
            console.log("DEBUG #5: Processed data. Resulting array length:", allMarketData.length);
            
            if (allMarketData.length === 0) {
                showError(`No market data found for "${commodity}" with the selected filters.`);
                return;
            }
            
            sortData();
            console.log("DEBUG #6: Data sorted.");
            renderTable();
            console.log("DEBUG #7: Table rendered.");
            renderChart();
            console.log("DEBUG #8: Chart rendered.");
            showResults();
            console.log("DEBUG #9: Results are now visible.");

        } catch (error) {
            console.error("DEBUG CATCH: An error was caught in fetchDataAndDisplay!", error);
            showError(error.message);
        }
    };
    
    // --- DATA PROCESSING AND RENDERING ---
    function processPriceData(records) {
        const safeRecords = records || [];
        const uniqueMarkets = new Map();
        safeRecords.forEach(rec => {
            if (rec && rec.market && !uniqueMarkets.has(rec.market)) {
                uniqueMarkets.set(rec.market, {
                    market: rec.market, state: rec.state,
                    min_price: parseFloat(rec.min_price) || 0,
                    max_price: parseFloat(rec.max_price) || 0,
                    modal_price: parseFloat(rec.modal_price) || 0
                });
            }
        });
        return Array.from(uniqueMarkets.values());
    }

    function renderTable() { /* Unchanged */ }
    function renderChart() { /* Unchanged */ }
    function populateStateFilter(records) { /* Unchanged */ }
    function sortData() { /* Unchanged */ }
    function handleSort(e) { /* Unchanged */ }
    function showLoading() { /* Unchanged */ }
    function showResults() { /* Unchanged */ }
    function showError(message) { /* Unchanged */ }
    function getFormattedDate(date, daysAgo = 0) { /* Unchanged */ }

    // --- Unchanged functions pasted below for completeness ---
    function renderTable() { priceTableBody.innerHTML = ''; allMarketData.forEach(item => { const row = document.createElement('tr'); row.innerHTML = `<td>${item.market}</td><td>${item.state}</td><td>${item.min_price.toFixed(2)}</td><td>${item.max_price.toFixed(2)}</td><td><strong>${item.modal_price.toFixed(2)}</strong></td>`; priceTableBody.appendChild(row); }); }
    function renderChart() { const chartData = [...allMarketData].sort((a,b) => b.modal_price - a.modal_price).slice(0, 15); const labels = chartData.map(item => item.market); if (priceChart) priceChart.destroy(); priceChart = new Chart(chartCanvas, { type: 'bar', data: { labels: labels, datasets: [ { label: 'Min Price (₹)', data: chartData.map(item => item.min_price), backgroundColor: 'rgba(255, 159, 64, 0.7)' }, { label: 'Max Price (₹)', data: chartData.map(item => item.max_price), backgroundColor: 'rgba(75, 192, 192, 0.7)' }, { label: 'Modal Price (₹)', data: chartData.map(item => item.modal_price), backgroundColor: 'rgba(54, 162, 235, 0.7)' } ] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Top 15 Markets by Modal Price' } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Price in Rupees (₹)' } } } } }); }
    function populateStateFilter(records) { if (stateFilter.options.length > 1 || !records) return; const states = [...new Set(records.map(rec => rec.state))].sort(); states.forEach(state => { const option = document.createElement('option'); option.value = state; option.textContent = state; stateFilter.appendChild(option); }); }
    function sortData() { allMarketData.sort((a, b) => { const valA = a[currentSort.key]; const valB = b[currentSort.key]; let comparison = (typeof valA === 'string') ? valA.localeCompare(valB) : valA - valB; return currentSort.order === 'asc' ? comparison : -comparison; }); }
    function handleSort(e) { const newKey = e.target.closest('[data-sort]')?.dataset.sort; if (!newKey) return; if (currentSort.key === newKey) { currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc'; } else { currentSort.key = newKey; currentSort.order = 'asc'; } sortData(); renderTable(); document.querySelectorAll('.results-table thead th').forEach(th => th.classList.remove('sorted-asc', 'sorted-desc')); e.target.closest('[data-sort]').classList.add(currentSort.order === 'asc' ? 'sorted-asc' : 'sorted-desc'); }
    function showLoading() { loader.classList.remove('hidden'); errorMessage.classList.add('hidden'); chartContainer.classList.add('hidden'); tableContainer.classList.add('hidden'); }
    function showResults() { loader.classList.add('hidden'); chartContainer.classList.remove('hidden'); tableContainer.classList.remove('hidden'); }
    function showError(message) { loader.classList.add('hidden'); errorMessage.textContent = message; errorMessage.classList.remove('hidden'); chartContainer.classList.add('hidden'); tableContainer.classList.add('hidden'); }
    function getFormattedDate(date, daysAgo = 0) { const targetDate = new Date(date); targetDate.setDate(targetDate.getDate() - daysAgo); return targetDate.toISOString().split('T')[0]; }

    // --- EVENT LISTENERS ---
    applyFiltersBtn.addEventListener('click', initializePage);
    document.querySelector('.results-table thead').addEventListener('click', handleSort);
    
    // --- INITIATE THE PAGE ---
    initializePage();
});