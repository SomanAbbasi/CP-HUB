// CP Hub - Client Script
// Mobile navigation, live countdown timer, and contest radar

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCountdownAndKontests();
});

// Mobile menu toggle
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('show');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Live Countdown Timer & Kontests API Radar
let countdownInterval = null;
const PINNED_STORAGE_KEY = 'cp_hub_pinned_contests';

function getPinnedContestNames() {
  try {
    return JSON.parse(localStorage.getItem(PINNED_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function savePinnedContestNames(list) {
  try {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

async function initCountdownAndKontests() {
  const countDays = document.getElementById('count-days');
  const timerDisplay = document.getElementById('timerDisplay');
  const radarContainer = document.getElementById('contestRadarGrid');

  if (!countDays && !timerDisplay && !radarContainer) return;

  if (radarContainer) {
    radarContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">
        <span class="pulse-dot" style="margin-right: 8px;"></span>
        Fetching live contest schedule...
      </div>
    `;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('https://kontests.net/api/v1/all', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Kontests API returned ${res.status}`);
    const allContests = await res.json();

    const now = new Date();
    const upcoming = allContests
      .filter((c) => {
        const start = new Date(c.start_time);
        return !isNaN(start.getTime()) && start > now;
      })
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    if (upcoming.length > 0) {
      startCountdownTimer(new Date(upcoming[0].start_time), upcoming[0].name);
      renderContestRadar(upcoming);
      return;
    }
    throw new Error('No upcoming contests found from live API');
  } catch (err) {
    console.warn('Using offline contest schedule fallback:', err.message);
    const fallbackContests = getFallbackContests();
    startCountdownTimer(new Date(fallbackContests[0].start_time), fallbackContests[0].name);
    renderContestRadar(fallbackContests);
  }
}

function getFallbackContests() {
  const now = Date.now();
  return [
    {
      name: 'Codeforces Round (Div. 2)',
      site: 'Codeforces',
      url: 'https://codeforces.com/contests',
      start_time: new Date(now + 2 * 86400000 + 4 * 3600000).toISOString(),
      duration: '7200'
    },
    {
      name: 'LeetCode Weekly Contest',
      site: 'LeetCode',
      url: 'https://leetcode.com/contest/',
      start_time: new Date(now + 4 * 86400000 + 9 * 3600000).toISOString(),
      duration: '5400'
    },
    {
      name: 'AtCoder Beginner Contest',
      site: 'AtCoder',
      url: 'https://atcoder.jp/contests/',
      start_time: new Date(now + 5 * 86400000 + 12 * 3600000).toISOString(),
      duration: '6000'
    },
    {
      name: 'Codeforces Educational Round',
      site: 'Codeforces',
      url: 'https://codeforces.com/contests',
      start_time: new Date(now + 7 * 86400000 + 6 * 3600000).toISOString(),
      duration: '7200'
    }
  ];
}

function startCountdownTimer(targetDate, contestName) {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');
  const labelEl = document.getElementById('next-contest-name');
  const timerDisplay = document.getElementById('timerDisplay');

  if (!daysEl && !timerDisplay) return;
  if (labelEl && contestName) labelEl.textContent = contestName;

  if (countdownInterval) clearInterval(countdownInterval);

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      if (timerDisplay) {
        timerDisplay.innerHTML = '<div class="contest-live-pulse" style="grid-column: 1 / -1; text-align: center; padding: 1rem; font-weight: 700; color: var(--accent-green);">🔥 CONTEST IS LIVE NOW!</div>';
      }
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

function renderContestRadar(contests) {
  const container = document.getElementById('contestRadarGrid');
  if (!container) return;

  const pinnedList = getPinnedContestNames();
  container.innerHTML = '';

  contests.slice(0, 6).forEach((c) => {
    const isPinned = pinnedList.includes(c.name);
    const startDate = new Date(c.start_time);
    const dateFormatted = startDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
    const timeFormatted = startDate.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
    const durationHours = (parseInt(c.duration, 10) / 3600).toFixed(1).replace('.0', '');

    const card = document.createElement('div');
    card.className = `radar-card ${isPinned ? 'pinned' : ''}`;

    let siteBadgeClass = 'badge-codeforces';
    const siteLower = (c.site || '').toLowerCase();
    if (siteLower.includes('leetcode')) siteBadgeClass = 'badge-leetcode';
    else if (siteLower.includes('atcoder')) siteBadgeClass = 'badge-atcoder';

    card.innerHTML = `
      <div class="radar-card-header">
        <span class="platform-badge ${siteBadgeClass}">${c.site || 'Contest'}</span>
        <button class="pin-btn ${isPinned ? 'active' : ''}" data-name="${encodeURIComponent(c.name)}" title="${isPinned ? 'Unpin' : 'Pin to my contests'}">
          ${isPinned ? '★ Pinned' : '☆ Pin'}
        </button>
      </div>
      <h3 class="radar-title">${c.name}</h3>
      <div class="radar-meta">
        <div>📅 ${dateFormatted} at ${timeFormatted}</div>
        <div>⏱️ Duration: ${durationHours} hrs</div>
      </div>
      <a href="${c.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="margin-top: 1rem; width: 100%; text-align: center;">
        View Official Details ↗
      </a>
    `;

    card.querySelector('.pin-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const currentPinned = getPinnedContestNames();
      let updated;
      if (currentPinned.includes(c.name)) {
        updated = currentPinned.filter((n) => n !== c.name);
      } else {
        updated = [...currentPinned, c.name];
      }
      savePinnedContestNames(updated);
      renderContestRadar(contests);
    });

    container.appendChild(card);
  });
}
