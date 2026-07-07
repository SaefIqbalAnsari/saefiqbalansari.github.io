// 1. DARK MODE LOGIC
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// Check saved theme in local storage
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateIcons(currentTheme);

themeToggleBtn.addEventListener('click', () => {
  let theme = document.documentElement.getAttribute('data-theme');
  let newTheme = theme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateIcons(newTheme);
});

function updateIcons(theme) {
  if (theme === 'dark') {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  } else {
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
  }
}

// 2. FADE IN ANIMATIONS ON SCROLL
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// 3. CHART JS CONFIGURATION
// Common options for responsiveness and fixing the stretch bug
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false, // Allows it to fill the .canvas-container
  plugins: {
    legend: { display: true, labels: { font: { family: 'DM Sans', size: 11 }, color: '#9a9693', boxWidth: 12 } },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { ticks: { font: { family: 'DM Sans', size: 11 }, color: '#9a9693' }, grid: { display: false } },
    y: { 
      type: 'linear', display: true, position: 'left',
      ticks: { font: { family: 'DM Sans', size: 10 }, color: '#9a9693', callback: v => (v/1000)+'k' }, 
      grid: { color: 'rgba(128,128,128,0.1)' } 
    },
    y2: {
      type: 'linear', display: true, position: 'right',
      ticks: { font: { family: 'DM Sans', size: 10 }, color: '#9a9693' },
      grid: { display: false }
    }
  }
};

// Search chart 
const searchLabels = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
const searchImpressions = [15000, 22000, 68000, 61000, 58000, 50000, 48000, 55000, 46000, 49000, 39000, 55000];
const searchClicks = [120, 180, 550, 480, 450, 390, 380, 450, 360, 410, 330, 500];

new Chart(document.getElementById('searchChart'), {
  data: {
    labels: searchLabels,
    datasets: [
      {
        type: 'bar', label: 'Impressions', data: searchImpressions,
        backgroundColor: 'rgba(200,75,47,0.15)', borderColor: '#c84b2f', borderWidth: 1, yAxisID: 'y'
      },
      {
        type: 'line', label: 'Clicks', data: searchClicks,
        borderColor: '#9a9693', borderWidth: 2, pointRadius: 2, pointBackgroundColor: '#9a9693', tension: 0.35, fill: false, yAxisID: 'y2'
      }
    ]
  },
  options: commonOptions
});

// LinkedIn chart 
const liLabels = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
const liImpr = [16000, 20000, 20000, 29000, 21000, 20000, 14000, 22000, 23000, 28000, 23000, 28000];
const liER = [35, 36, 25, 25, 22, 35, 25, 56, 53, 28, 50, 22];

// Clone common options and update right Y axis for percentage
const liOptions = JSON.parse(JSON.stringify(commonOptions));
liOptions.scales.y2.ticks.callback = v => v + '%';

new Chart(document.getElementById('liChart'), {
  data: {
    labels: liLabels,
    datasets: [
      {
        type: 'bar', label: 'Impressions', data: liImpr,
        backgroundColor: 'rgba(154,150,147,0.15)', borderColor: '#9a9693', borderWidth: 1, yAxisID: 'y'
      },
      {
        type: 'line', label: 'Engagement Rate %', data: liER,
        borderColor: '#c84b2f', borderWidth: 2, pointRadius: 2, pointBackgroundColor: '#c84b2f', tension: 0.35, fill: false, yAxisID: 'y2'
      }
    ]
  },
  options: liOptions
});
