// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const BACKEND_URL = 'http://localhost:3001';

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
    let priceChart = null;
    
    // --- STATE MANAGEMENT ---
    let allMarketData = []; // To store all fetched data for client-side sorting/filtering
    let currentSort = { key: 'market', order: 'asc' }; // Initial sort order

    // --- MAIN FUNCTION ---
    const initializePage = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const commodity = urlParams.get('commodity');

        if (!commodity) {
            showError("No crop specified. Please go back and search.");
            return;
        }
        
        const displayCommodity = commodity.charAt(0).toUpperCase() + commodity.slice(1);
        searchTitle.textContent = `Price Results for ${displayCommodity}`;

        await fetchDataAndDisplay(commodity, stateFilter.value);
    };

    const fetchDataAndDisplay = async (commodity, state = "") => {
        showLoading();
        try {
            const date = getFormattedDate(new Date(), 1); // Get yesterday's data for reliability

            // Build the API URL with filters
            let apiUrl = `${BACKEND_URL}/api/prices?commodity=${commodity}&date=${date}`;
            if (state) {
                apiUrl += `&state=${state}`;
            }
            
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Could not fetch data from the server. Is it running?");

            const data = await response.json();
            allMarketData = processPriceData(data.records);
            
            if (allMarketData.length === 0) {
                showError(`No market data found for "${commodity}" with the selected filters.`);
                return;
            }
            
            populateStateFilter(data.records); // Populate filter with available states
            sortData(); // Apply initial sort
            renderTable();
            renderChart();
            showResults();

        } catch (error) {
            console.error("Fetch error:", error);
            showError(error.message);
        }
    };
    
    // --- DATA PROCESSING AND RENDERING ---
    function processPriceData(records) {
        return records.map(rec => ({
            market: rec.market,
            state: rec.state,
            min_price: parseFloat(rec.min_price) || 0,
            max_price: parseFloat(rec.max_price) || 0,
            modal_price: parseFloat(rec.modal_price) || 0
        }));
    }

    function renderTable() {
        priceTableBody.innerHTML = ''; // Clear existing table
        allMarketData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.market}</td>
                <td>${item.state}</td>
                <td>${item.min_price.toFixed(2)}</td>
                <td>${item.max_price.toFixed(2)}</td>
                <td><strong>${item.modal_price.toFixed(2)}</strong></td>
            `;
            priceTableBody.appendChild(row);
        });
    }

    function renderChart() {
        const chartData = [...allMarketData].sort((a,b) => b.modal_price - a.modal_price).slice(0, 15);
        const labels = chartData.map(item => item.market);
        
        if (priceChart) priceChart.destroy();

        priceChart = new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Min Price (₹)', data: chartData.map(item => item.min_price), backgroundColor: 'rgba(255, 159, 64, 0.7)' },
                    { label: 'Max Price (₹)', data: chartData.map(item => item.max_price), backgroundColor: 'rgba(75, 192, 192, 0.7)' },
                    { label: 'Modal Price (₹)', data: chartData.map(item => item.modal_price), backgroundColor: 'rgba(54, 162, 235, 0.7)' }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Top 15 Markets by Modal Price' }
                },
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Price in Rupees (₹)' } } }
            }
        });
    }

    // --- FILTERING AND SORTING ---
    function populateStateFilter(records) {
        if (stateFilter.options.length > 1) return; // Only populate once
        const states = [...new Set(records.map(rec => rec.state))].sort();
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateFilter.appendChild(option);
        });
    }
    
    function sortData() {
        allMarketData.sort((a, b) => {
            const valA = a[currentSort.key];
            const valB = b[currentSort.key];
            
            let comparison = 0;
            if (typeof valA === 'string') {
                comparison = valA.localeCompare(valB);
            } else {
                comparison = valA - valB;
            }
            return currentSort.order === 'asc' ? comparison : -comparison;
        });
    }

    function handleSort(e) {
        const newKey = e.target.dataset.sort;
        if (!newKey) return;
        
        if (currentSort.key === newKey) {
            currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.key = newKey;
            currentSort.order = 'asc';
        }
        
        sortData();
        renderTable();
        // Update header styles
        document.querySelectorAll('.results-table thead th').forEach(th => th.classList.remove('sorted-asc', 'sorted-desc'));
        e.target.classList.add(currentSort.order === 'asc' ? 'sorted-asc' : 'sorted-desc');
    }

    // --- UI STATE HELPERS ---
    function showLoading() {
        loader.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        chartContainer.classList.add('hidden');
        tableContainer.classList.add('hidden');
    }
    
    function showResults() {
        loader.classList.add('hidden');
        errorMessage.classList.add('hidden');
        chartContainer.classList.remove('hidden');
        tableContainer.classList.remove('hidden');
    }

    function showError(message) {
        loader.classList.add('hidden');
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        chartContainer.classList.add('hidden');
        tableContainer.classList.add('hidden');
    }

    // --- UTILITY ---
    function getFormattedDate(date, daysAgo = 0) {
        const targetDate = new Date(date);
        targetDate.setDate(targetDate.getDate() - daysAgo);
        return targetDate.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    }

    // --- EVENT LISTENERS ---
    applyFiltersBtn.addEventListener('click', () => {
        const commodity = new URLSearchParams(window.location.search).get('commodity');
        fetchDataAndDisplay(commodity, stateFilter.value);
    });

    document.querySelector('.results-table thead').addEventListener('click', handleSort);

    // --- INITIATE THE PAGE ---
    initializePage();
});