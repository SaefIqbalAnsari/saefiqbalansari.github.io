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
function getChartOptions(metricType) {
  const isPosition = metricType === 'position';
  const axisColor = '#706d6a'; 
  const gridColor = 'rgba(128,128,128,0.15)';

  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: { 
      padding: { left: 10, right: 10, top: 10, bottom: 0 } 
    },
    plugins: {
      legend: { display: true, labels: { font: { family: 'DM Sans', size: 11, weight: 'bold' }, color: axisColor, boxWidth: 12 } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { 
        ticks: { font: { family: 'DM Sans', size: 11 }, color: axisColor, maxRotation: 45, minRotation: 45 }, 
        grid: { display: false } 
      },
      y: { 
        type: 'linear', display: true, position: 'left',
        ticks: { 
          font: { family: 'DM Sans', size: 10 }, 
          color: axisColor, 
          callback: function(value) { return value === 0 ? '0' : (value >= 1000 ? (value / 1000) + 'k' : value); } 
        }, 
        grid: { color: gridColor }, 
        beginAtZero: true
      },
      y2: {
        type: 'linear', display: isPosition, position: 'right', 
        reverse: isPosition, 
        min: isPosition ? 1 : undefined,
        max: isPosition ? 60 : undefined,
        ticks: { 
          font: { family: 'DM Sans', size: 10 }, 
          color: axisColor, 
          callback: function(value) { return 'Pos ' + value; }
        },
        grid: { display: false },
        beginAtZero: false
      }
    }
  };
}

// Chart 1: Search Performance (Impressions vs Average Position)
const searchLabels = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
const searchImpressions = [12000, 14000, 22000, 38000, 48000, 52000, 55000, 68000, 59000, 65000, 58000, 64000]; 
const searchPosition = [57, 54, 45, 30, 22, 18, 15, 11, 10, 10, 11, 10]; 

new Chart(document.getElementById('searchChart'), {
  data: {
    labels: searchLabels,
    datasets: [
      {
        type: 'bar', label: 'Impressions', data: searchImpressions,
        backgroundColor: 'rgba(184,59,31,0.15)', borderColor: '#b83b1f', borderWidth: 1, yAxisID: 'y'
      },
      {
        type: 'line', label: 'Avg Position', data: searchPosition,
        borderColor: '#706d6a', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#706d6a', tension: 0.35, fill: false, yAxisID: 'y2'
      }
    ]
  },
  options: getChartOptions('position')
});

// Chart 2: LinkedIn Follower Growth (Area Chart tracking 0 to 4800)
const growthLabels = ['Nov 2022', 'Nov 2023', 'Nov 2024', 'Nov 2025', 'Jun 2026'];
const followerGrowth = [0, 1600, 3200, 4200, 4800]; 

new Chart(document.getElementById('liChart'), {
  data: {
    labels: growthLabels,
    datasets: [
      {
        type: 'line', 
        label: 'Total Followers', 
        data: followerGrowth,
        borderColor: '#b83b1f', 
        backgroundColor: 'rgba(184,59,31,0.1)', 
        borderWidth: 2, 
        pointRadius: 4, 
        pointBackgroundColor: '#b83b1f', 
        tension: 0.3, 
        fill: true, 
        yAxisID: 'y'
      }
    ]
  },
  options: getChartOptions('growth') 
});
