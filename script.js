// Constants
const STORAGE_KEY = 'learningTracker';
const DAYS_IN_YEAR = 365;

// DOM Elements
const trackButton = document.getElementById('trackButton');
const todayStatus = document.getElementById('todayStatus');
const totalStatus = document.getElementById('totalStatus');
const contributionGraph = document.getElementById('contributionGraph');

// Initialize or load data
let learningData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Calculate total hours
function calculateTotalHours() {
    return Object.values(learningData).reduce((sum, hours) => sum + hours, 0);
}

// Update status displays
function updateTodayStatus() {
    const today = formatDate(new Date());
    const hoursToday = learningData[today] || 0;
    todayStatus.textContent = `Hours tracked today: ${hoursToday}`;
    totalStatus.textContent = `Total hours tracked: ${calculateTotalHours()}`;
}

// Track learning time
trackButton.addEventListener('click', () => {
    const today = formatDate(new Date());
    learningData[today] = (learningData[today] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(learningData));
    updateTodayStatus();
    renderContributionGraph();
});

// Render contribution graph
function renderContributionGraph() {
    contributionGraph.innerHTML = '';
    const today = new Date();
    const graphContainer = document.createElement('div');
    graphContainer.className = 'grid grid-cols-[repeat(53,1fr)] gap-1';

    // Generate dates for the last year
    for (let i = DAYS_IN_YEAR; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        const hours = learningData[dateStr] || 0;

        const box = document.createElement('div');
        box.className = `w-3 h-3 rounded-sm ${getColorClass(hours)}`;
        box.title = `${dateStr}: ${hours} hours`;
        graphContainer.appendChild(box);
    }

    contributionGraph.appendChild(graphContainer);
}

// Get color class based on hours
function getColorClass(hours) {
    if (hours === 0) return 'bg-gray-700';
    if (hours === 1) return 'bg-green-800';
    if (hours === 2) return 'bg-green-600';
    if (hours === 3) return 'bg-green-500';
    return 'bg-green-400';
}

// Initial render
updateTodayStatus();
renderContributionGraph();
