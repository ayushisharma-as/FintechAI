// ---- MARKET GROWTH DATA FOR CHART ----
const marketData = {
  growth_2023_2030: [
    {year: 2023, value: 42.83},
    {year: 2024, value: 44.08},
    {year: 2025, value: 46.5},
    {year: 2026, value: 48.8},
    {year: 2027, value: 51.2},
    {year: 2028, value: 53.7},
    {year: 2029, value: 56.3},
    {year: 2030, value: 59.1}
  ]
};


// ---- LIVE MARKET DATA (API+SIMULATOR) ----
const REAL_API_KEY = 'BMC50EON4T95LO2F'; // Add your own API key if rotating/expired
const REAL_TICKERS = ['AAPL', 'MSFT', 'GOOGL'];

// Prefer API, fallback to sim
async function fetchMarketPrices() {
  const feedList = document.getElementById('market-feed-list');
  if (!feedList) return;
  feedList.innerHTML = "";
  let usedSim = false;

  for (const ticker of REAL_TICKERS) {
    try {
      const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${REAL_API_KEY}`);
      const data = await res.json();
      if (data['Global Quote'] && data['Global Quote']['05. price'] && !Number.isNaN(parseFloat(data['Global Quote']['05. price']))) {
        let price = parseFloat(data['Global Quote']['05. price']).toFixed(2);
        let li = document.createElement('li');
        li.textContent = `${ticker}: $${price}`;
        feedList.appendChild(li);
      } else throw "No data";
    } catch {
      // Graceful fallback: live simulation
      usedSim = true;
      let li = document.createElement('li');
      li.textContent = `${ticker}: $${(100+Math.random()*100).toFixed(2)} (Sim)`;
      feedList.appendChild(li);
    }
  }
  if (usedSim) {
    // Add a one-line note only if using sim
    let li = document.createElement('li');
    li.textContent = '(Demo: Simulated for API Demo)';
    li.style.color = "#ffe082";
    feedList.appendChild(li);
  }
}

// ---- LIVE CHART (API or fallback sim) ----
const chartCtx = document.getElementById('liveChart').getContext('2d');
let chartData = {
  labels: [],
  datasets: [{
    label: REAL_TICKERS[0] + ' Price',
    data: [],
    fill: false,
    borderColor: '#21d97a',
    tension: 0.2
  }]
};
const liveChart = new Chart(chartCtx, {
  type: 'line',
  data: chartData, 
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeOutQuart"
    },
    scales: {
      x: { ticks: { color: '#d7f1ff' }, grid: { color: '#28384844' } },
      y: { ticks: { color: '#d7f1ff' }, grid: { color: '#28384844' } }
    },
    plugins: {
      legend: { labels: { color: '#fff', font: { weight: 'bold' } }},
      title: { display: false }
    }
  }
});
async function updateLiveChart() {
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${REAL_TICKERS[0]}&apikey=${REAL_API_KEY}`);
    const data = await res.json();
    let price = (data['Global Quote'] && data['Global Quote']['05. price']) ? parseFloat(data['Global Quote']['05. price']) : (100+Math.random()*100);
    if (chartData.labels.length > 30) { chartData.labels.shift(); chartData.datasets[0].data.shift(); }
    chartData.labels.push((new Date()).toLocaleTimeString());
    chartData.datasets[0].data.push(price);
    liveChart.update();
  } catch {
    // Simulated data fallback
    let price = 120 + Math.random() * 30;
    if (chartData.labels.length > 30) { chartData.labels.shift(); chartData.datasets[0].data.shift(); }
    chartData.labels.push((new Date()).toLocaleTimeString());
    chartData.datasets[0].data.push(price);
    liveChart.update();
  }
}

// ---- HERO/COUNTER ANIMATION ----
function initializeAnimatedCounters() {
  const counters = document.querySelectorAll('[data-target]');
  counters.forEach(counter => {
    let started = false;
    const animate = () => {
      if (started) return;
      started = true;
      const target = parseFloat(counter.getAttribute('data-target'));
      const incr = target / 100;
      let curr = 0;
      const frame = () => {
        curr += incr;
        if (curr >= target) curr = target;
        counter.textContent = (target >= 10 ? '$' : '') + curr.toFixed(1) + (target >= 10 ? 'B' : '%');
        if (curr < target) requestAnimationFrame(frame);
      };
      frame();
    };
    // Intersection
    const obs = new IntersectionObserver((e) => { if (e[0].isIntersecting) animate(); }, { threshold: 0.6 });
    obs.observe(counter);
  });
}

// ---- SECTION FADE-IN ANIMATIONS ----
function initializeScrollAnimations() {
  document.querySelectorAll('.solution-card, .stat-card, .challenge-card, .trend-card, .stack-layer')
    .forEach(el => el.classList.add('fade-in'));
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -38px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => scrollObserver.observe(el));
}

// ---- SOLUTION CARD MODALS ----
function initializeSolutionCards() {
  const solutionCards = document.querySelectorAll('.solution-card');
  solutionCards.forEach((card, i) => {
    card.addEventListener('click', () => showSolutionDetails(i));
  });
}
function showSolutionDetails(i) {
  const all = [
    {name:"Real-Time Trading Co-Pilot",tech:["LSTM","CNN","RL","Kafka"],info:"66% avg returns, 92% success."},
    {name:"Live Sanctions Monitor",tech:["NLP","ML","Entity Res."],info:"<350ms, 95% reduction."},
    {name:"KYC Anomaly Detector",tech:["Autoencoders","Clustering"],info:"98.7% accuracy, <5% false positive."},
    {name:"Market Risk & Scanner",tech:["Flink","DL","Distributed"],info:"Multi-exchange, real-time anomaly."}
  ];
  const d=all[i]; alert(`${d.name}\nTech: ${d.tech.join(", ")}\n${d.info}`);
}

// ---- SMOOTH SCROLL & NAV HIGHLIGHT ----
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const t = document.querySelector(link.getAttribute('href'));
      if (t) window.scrollTo({top: t.offsetTop-80, behavior:'smooth'});
    });
  });
  // Highlight
  window.addEventListener('scroll', () => {
    const links = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');
    const scroll = window.scrollY + 100;
    sections.forEach(section => {
      if (scroll >= section.offsetTop && scroll < section.offsetTop + section.offsetHeight) {
        links.forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`[href="#${section.id}"]`).forEach(l=>l.classList.add('active'));
      }
    });
  });
}

// ---- FAKE "AI" SIGNAL, ANOMALY, RISK DASHBOARD ----
const DEMO_TICKERS = ['BTC/USD', 'AAPL', 'NIFTY', 'EUR/USD'];
setInterval(() => {
    // Ticker simulation for Risk/Anomaly dashboard
    let feedList = document.getElementById('market-feed-list');
    if(feedList) feedList.innerHTML = ''; // Avoid conflict with real prices if API fails
    DEMO_TICKERS.forEach(ticker => {
      let li = document.createElement('li');
      li.innerText = `${ticker}: $${(Math.random() * 1000 + 100).toFixed(2)}`;
      feedList && feedList.appendChild(li);
    });
    // AI Signal
    const signals = ['Buy', 'Sell', 'Hold'];
    let signal = signals[Math.floor(Math.random() * signals.length)];
    let aiSignalDiv = document.getElementById('ai-signal');
    if (aiSignalDiv) {
      aiSignalDiv.innerHTML = `Signal: ${signal} (${DEMO_TICKERS[0]}) <span class="explain-btn" onclick="showExplain()">?</span>`;
      aiSignalDiv.className = signal.toLowerCase() ? `buy ai-signal ${signal.toLowerCase()}` : "ai-signal";
    }
    // Anomaly Alerts
    let anomalyDiv = document.getElementById('anomaly-alerts');
    if (anomalyDiv) {
      if (Math.random() > 0.8) {
        anomalyDiv.textContent = `ALERT: Unusual spike in ${DEMO_TICKERS[Math.floor(Math.random()*DEMO_TICKERS.length)]}`;
        anomalyDiv.classList.add("alert"); anomalyDiv.classList.remove("stable");
      } else {
        anomalyDiv.textContent = 'All markets stable';
        anomalyDiv.classList.remove("alert"); anomalyDiv.classList.add("stable");
      }
    }
    // Risk Map
    let ctx = document.getElementById('riskHeatmap');
    if (ctx && ctx.getContext) {
      let cc = ctx.getContext('2d');
      cc.clearRect(0,0,ctx.width,ctx.height);
      for (let i=0;i<DEMO_TICKERS.length;i++) {
        let risk = Math.random();
        cc.fillStyle = risk > 0.7 ? '#FF5252' : (risk > 0.5 ? '#FFE082' : '#2FCC50');
        cc.fillRect(i*150,60,120,20);
        cc.fillStyle = '#222';
        cc.fillText(DEMO_TICKERS[i],i*150+9,50);
        cc.fillStyle = "#fff";
        cc.fillText(`Risk ${Math.round(risk*100)}%`,i*150+10,75);
      }
    }
}, 4000);


// ---- SIMULATED TRADE LOGIC ----
let simulatedPnL = 0;
window.simulateTrade = () => {
  let delta = ((Math.random() - 0.5) * 100).toFixed(2);
  simulatedPnL += parseFloat(delta);
  document.getElementById('trade-pnl').innerHTML = `<b>Simulated P&amp;L:</b> <span style="color:${delta>=0?'#19d219':'#d21119'}">${delta}</span> Total: ${simulatedPnL.toFixed(2)}`;
};


// ---- EXPLAINABILITY MODAL ----
window.showExplain = function() { document.getElementById('modal-explain').style.display='block'; }
window.hideExplain = function() { document.getElementById('modal-explain').style.display='none'; }

// ---- HERO/CTA BUTTONS ----
document.addEventListener('click', function(e) {
  if (e.target.matches('.btn')) {
    const txt = e.target.textContent.trim();
    if (txt === 'Explore Solutions') scrollToSection('solutions');
    if (txt === 'View Architecture') scrollToSection('architecture');
    if (txt === 'Schedule Demo') alert('Demo booking would open a calendar. (Demo only)');
    if (txt === 'Download Whitepaper') alert('PDF download (demo only)');
  }
});
function scrollToSection(sectionId) {
  const ele = document.getElementById(sectionId);
  if (ele) window.scrollTo({top:ele.offsetTop-80,behavior:'smooth'});
}

// ---- DYNAMIC VISUAL EFFECTS (bonus) ----
function addDynamicEffects() {
    // Little parallax in hero background
    window.addEventListener('scroll', () => {
      let scrolled = window.pageYOffset;
      let hero = document.querySelector('.hero');
      if (hero) hero.style.transform = `translateY(${-scrolled*0.2}px)`;
    });
    // Wobble tech tags
    document.querySelectorAll('.tech-tag').forEach((t,i) => {
      t.style.animationDelay = `${i*0.07}s`;
      t.addEventListener('mouseenter', ()=>t.style.transform="scale(1.08)");
      t.addEventListener('mouseleave', ()=>t.style.transform="scale(1)");
    });
}


// ---- BOOTSTRAP EVERYTHING ON DOMContentLoaded ----
window.addEventListener('DOMContentLoaded', function() {
  try {
    fetchMarketPrices();
    updateLiveChart();
    setInterval(fetchMarketPrices, 20000);
    setInterval(updateLiveChart, 20000);
    initializeAnimatedCounters();
    initializeSolutionCards();
    initializeScrollAnimations();
    initializeNavigation();
    addDynamicEffects();
  } catch (e) {/* no-op */}
  initializeChart();
});

// ---- STATIC MARKET GROWTH CHART ----
function initializeChart() {
  const ctx = document.getElementById('marketChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: marketData.growth_2023_2030.map(item => item.year),
      datasets: [{
        label: 'Market Size (Billion USD)',
        data: marketData.growth_2023_2030.map(item => item.value),
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1FB8CD',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        custom_canvas_background_color: {},
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#f5f5f5',
            font: { size: 14, weight: '500' }
          }
        },
        title: {
          display: true,
          text: 'Fintech Market Growth Projection (2023-2030)',
          color: '#f5f5f5',
          font: { size: 16, weight: '600' }
        }
      },
      layout: { padding: 10 },
      scales: {
        x: {
          grid: { color: 'rgba(119, 124, 124, 0.2)' },
          ticks: { color: '#a7a9a9' }
        },
        y: {
          grid: { color: 'rgba(119, 124, 124, 0.2)' },
          ticks: {
            color: '#a7a9a9',
            callback: value => '$' + value + 'B'
          }
        }
      },
      interaction: { intersect: false, mode: 'index' },
      animation: { duration: 1600, easing: 'easeInOutQuart' }
    },
    plugins: [{
      id: 'custom_canvas_background_color',
      beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#181e23'; // Match your site dark bg
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    }]
  });
}

// ---- LIVE PRICE CHART (NO OVERLAP) ----
// (Removed duplicate chartCtx, chartData, and liveChart declarations to avoid redeclaration error)

let block = document.createElement('div');
block.className = 'risk-block';

let label = document.createElement('div');
label.className = 'risk-asset-label';
label.textContent = assetName;  // e.g., 'BTC/USD'

let bar = document.createElement('div');
bar.className = 'risk-bar ' + riskLevel; // low/high/medium
bar.textContent = `Risk ${percent}%`;

block.appendChild(label);
block.appendChild(bar);
riskBox.appendChild(block);


