# Competitive Programming Hub (CP Hub)

A modern, responsive web application and community hub for competitive programmers preparing for contests (ICPC, Codeforces, LeetCode, AtCoder) and upsolving algorithmic problems.

---

## Overview

Competitive Programming Hub brings contest schedules, curated algorithm implementations with formal problem statements, a multi-platform scoreboard, and competitor profiling into a unified, minimalist interface.

---

## Key Features

### 1. Live Contest Radar & Dynamic Countdown
- Queries the free **Kontests API** to calculate the closest upcoming contest across platforms (Codeforces, LeetCode, AtCoder).
- Real-time 1-second interval countdown timer displaying days, hours, minutes, and seconds.
- Upcoming contest radar cards with an offline-safe fallback.
- **Pin to My Contests** feature using `localStorage` to bookmark favorite competitions.

### 2. Interactive Algorithm Library & Problem Cards
- **Curated High-Yield Categories**: Focused on **Backtracking**, **Bit-Manipulation**, and **Cache** (21 total verified algorithms).
- **Formal Problem Statement Cards**: Each algorithm displays a formal task statement, constraints, example input/output boxes with explanations, asymptotic complexities (O), and direct 1-click practice links to LeetCode, CSES, and GeeksforGeeks.
- **Interactive Code Viewer**: Fast 1-click clipboard copy and upstream source links.
- **Dual Mode**: Switch between the repository tree explorer and a curated CP Contest Playbook (C++ & Python templates).

### 3. Multi-Platform Leaderboard & Standings
- Unified scoreboard displaying competitor ratings, solved counts, and club rank tiers (Newbie to Grandmaster).
- Platform filter pills for **All**, **Codeforces**, **LeetCode**, and **AtCoder**.
- Sortable table columns (by rating, problems solved, or rank).

### 4. Live Handle Inspector
- Query live public competitor data via the **Codeforces REST API** (`user.info` and `user.rating`).
- Real-time profile lookup displaying current rating, global max rank, avatar, and top topic strengths.
- 1-click button to dynamically add inspected profiles into the active scoreboard.

### 5. Membership Registration & Form Validation
- Client-side regular expression validation for full names, emails, and platform handles.
- Automated pre-submission verification querying live APIs to ensure handles actually exist.
- Seamless `localStorage` persistence appending newly registered members into the live leaderboard.

---

## Project Structure

```
d:\CP\
├── css\
│   └── styles.css          # Unified light-theme stylesheet
├── data\
│   ├── algorithms.json     # Curated algorithm catalog
│   └── algorithms-data.js  # Offline-safe client dataset
├── js\
│   └── script.js           # Client application logic
├── about.html              # Club background, rules & rating tiers
├── algorithms.html         # Algorithm library & contest playbook
├── index.html              # Home landing page with countdown & radar
├── join.html               # Registration form with live validation
├── leaderboard.html        # Scoreboard & live handle inspector
└── Readme.md               # Project documentation
```

---

## Tech Stack

- **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
- **CSS3**: CSS Custom Properties (variables), Flexbox, CSS Grid, media queries for responsiveness.
- **JavaScript (ES6+)**: DOM Manipulation, Async/Await & Fetch API, Regular Expressions, `localStorage` API, Event Listeners.

---

## Getting Started

1. Clone or download the repository:
   ```bash
   git clone https://github.com/SomanAbbasi/CP-HUB.git
   ```
2. Open `index.html` in any modern web browser. No server build step or external dependencies required.

---

## Author

**Soman Abbasi**  
Email: `mssabbasi306@gmail.com`  
GitHub: [@SomanAbbasi](https://github.com/SomanAbbasi)
