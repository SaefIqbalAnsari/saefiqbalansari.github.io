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
  // metricType can be 'position' or 'percentage'
  const isPosition = metricType === 'position';
  const isPercentage = metricType === 'percentage';

  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: { 
      padding: { left: 10, right: 10, top: 10, bottom: 0 } // Prevents any label clipping on the edges
    },
    plugins: {
      legend: { display: true, labels: { font: { family: 'DM Sans', size: 11 }, color: '#9a9693', boxWidth: 12 } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { 
        ticks: { font: { family: 'DM Sans', size: 11 }, color: '#9a9693', maxRotation: 45, minRotation: 45 }, 
        grid: { display: false } 
      },
      y: { 
        type: 'linear', display: true, position: 'left',
        ticks: { 
          font: { family: 'DM Sans', size: 10 }, 
          color: '#9a9693', 
          // Forces '10k' formatting instead of '10,000' to prevent the cutoff bug
          callback: function(value) { return value === 0 ? '0' : (value / 1000) + 'k'; } 
        }, 
        grid: { color: 'rgba(128,128,128,0.1)' }, 
        beginAtZero: true
      },
      y2: {
        type: 'linear', display: true, position: 'right',
        reverse: isPosition, // Flips the axis so Position 1 is at the top of the chart!
        min: isPosition ? 1 : undefined, // Sets absolute top of chart to Position 1
        max: isPosition ? 60 : undefined, // Sets absolute bottom of chart to Position 60
        ticks: { 
          font: { family: 'DM Sans', size: 10 }, 
          color: isPercentage ? '#c84b2f' : (isPosition ? '#0f0e0d' : '#9a9693'), 
          callback: function(value) { 
            if (isPercentage) return value + '%';
            if (isPosition) return 'Pos ' + value;
            return value;
          }
        },
        grid: { display: false },
        beginAtZero: isPercentage
      }
    }
  };
}

// Search chart (Impressions vs Average Position)
const searchLabels = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
const searchImpressions = [12000, 14000, 22000, 38000, 48000, 52000, 55000, 68000, 59000, 65000, 58000, 64000]; 
const searchPosition = [57, 54, 45, 30, 22, 18, 15, 11, 10, 10, 11, 10]; // Dropping rank numbers = higher on the chart

new Chart(document.getElementById('searchChart'), {
  data: {
    labels: searchLabels,
    datasets: [
      {
        type: 'bar', label: 'Impressions', data: searchImpressions,
        backgroundColor: 'rgba(200,75,47,0.15)', borderColor: '#c84b2f', borderWidth: 1, yAxisID: 'y'
      },
      {
        type: 'line', label: 'Avg Position', data: searchPosition,
        borderColor: '#9a9693', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#9a9693', tension: 0.35, fill: false, yAxisID: 'y2'
      }
    ]
  },
  options: getChartOptions('position')
});

// LinkedIn chart (Impressions vs Engagement Rate)
const liLabels = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
const liImpr = [16000, 19000, 19000, 29000, 21000, 20000, 14000, 25000, 23000, 28000, 23000, 28000];
const liER = [35, 36, 25, 25, 22, 35, 25, 56, 53, 28, 50, 22]; 

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
        borderColor: '#c84b2f', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#c84b2f', tension: 0.35, fill: false, yAxisID: 'y2'
      }
    ]
  },
  options: getChartOptions('percentage')
});
