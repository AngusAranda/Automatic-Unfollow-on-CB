// ==UserScript==
// @name         CB Unfollow Manager
// @namespace    https://github.com/AngusAranda/Automatic-Unfollow-on-CB/
// @version      3.0
// @description  Clean, fast, and reliable auto-unfollow with UI, refresh, and full control
// @match        https://chaturbate.com/followed-cams
// @match        https://chaturbate.com/followed-cams/
// @match        https://chaturbate.com/followed-cams/offline
// @match        https://chaturbate.com/followed-cams/offline/
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const unfollowDelay = 1000;
  const postUnfollowWait = 2000;
  const localStorageKey = 'cb_unfollow_auto_enabled';

  let timeoutHandles = [];
  let isRunning = false;

  // Ensure refresh works even if tab is inactive
  function safeReload() {
    if (document.visibilityState === 'visible') {
      window.location.href = window.location.href;
    } else {
      window.__pendingAutoReload = true;
      console.log('⏸ Tab not visible — delaying reload');
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.__pendingAutoReload) {
      window.__pendingAutoReload = false;
      console.log('▶️ Tab visible again — refreshing now');
      window.location.href = window.location.href;
    }
  });

  // Inject CSS spinner
  const spinnerCSS = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  const styleEl = document.createElement("style");
  styleEl.innerText = spinnerCSS;
  document.head.appendChild(styleEl);

  function createControlPanel() {
    const panel = document.createElement('div');
    panel.innerHTML = `
      <div id="unfollowPanel" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background: #111;
        color: #fff;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        font-family: sans-serif;
        width: 240px;
        text-align: center;
      ">
        <div style="font-size: 16px; font-weight: bold;">🔄 Unfollow Panel</div>
        <button id="startUnfollowBtn" style="margin-top: 10px; padding: 6px 12px; background: #e91e63; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Start Unfollowing</button>
        <button id="refreshPageBtn" style="margin-top: 10px; padding: 6px 12px; background: #607d8b; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Refresh Page</button>
        <button id="autoToggleBtn" style="margin-top: 10px; padding: 6px 12px; background: #4caf50; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Enable Auto Mode</button>
        <div id="statusDisplay" style="margin-top: 10px; display: none;">
          <div style="margin-bottom: 5px;">
            <span id="spinner" style="
              display: inline-block;
              width: 16px;
              height: 16px;
              border: 2px solid #fff;
              border-top: 2px solid #e91e63;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-right: 5px;
            "></span>
            <span id="camsRemaining">Remaining: 0</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
  }

  function updateAutoModeButton() {
    const autoBtn = document.getElementById('autoToggleBtn');
    const isEnabled = localStorage.getItem(localStorageKey) === 'true';
    autoBtn.textContent = isEnabled ? 'Disable Auto Mode' : 'Enable Auto Mode';
    autoBtn.style.background = isEnabled ? '#f44336' : '#4caf50';
  }

  function cancelUnfollowQueue() {
    timeoutHandles.forEach(clearTimeout);
    timeoutHandles = [];
    isRunning = false;

    document.getElementById('statusDisplay').style.display = 'none';
    const btn = document.getElementById('startUnfollowBtn');
    btn.textContent = 'Start Unfollowing';
    btn.disabled = false;

    console.log('🛑 Unfollow process manually stopped.');
  }

  function unfollowAllVisible(autoMode = false) {
    const buttons = [...document.querySelectorAll('div.follow_star.icon_following[title="Unfollow"]')];
    const total = buttons.length;
    let remaining = total;

    const statusDisplay = document.getElementById('statusDisplay');
    const countDisplay = document.getElementById('camsRemaining');
    const startBtn = document.getElementById('startUnfollowBtn');

    if (total === 0) {
      console.log("✅ No more users to unfollow on this page.");
      if (autoMode) setTimeout(() => safeReload(), 1000);
      return;
    }

    isRunning = true;
    statusDisplay.style.display = "block";
    countDisplay.textContent = `Remaining: ${remaining}`;
    startBtn.textContent = "Stop Unfollowing";

    buttons.forEach((btn, i) => {
      const handle = setTimeout(() => {
        if (!isRunning) return;
        btn.click();
        remaining--;
        countDisplay.textContent = `Remaining: ${remaining}`;
        console.log(`🚫 Unfollowed #${i + 1}`);
      }, i * unfollowDelay);
      timeoutHandles.push(handle);
    });

    const totalTime = total * unfollowDelay + postUnfollowWait;

    setTimeout(() => {
      if (isRunning) {
        statusDisplay.style.display = 'none';
        startBtn.textContent = 'Start Unfollowing';
        isRunning = false;
        timeoutHandles = [];
        if (autoMode) safeReload();
      }
    }, totalTime);
  }

  function runAutoIfEnabled() {
    const enabled = localStorage.getItem(localStorageKey) === 'true';
    if (enabled) {
      console.log("⚙️ Auto Mode is ON — starting unfollow loop...");
      setTimeout(() => unfollowAllVisible(true), 1000);
    }
  }

  window.addEventListener('load', () => {
    createControlPanel();
    updateAutoModeButton();

    const startBtn = document.getElementById('startUnfollowBtn');
    startBtn.addEventListener('click', () => {
      if (isRunning) {
        cancelUnfollowQueue();
      } else {
        unfollowAllVisible(false);
      }
    });

    document.getElementById('refreshPageBtn').addEventListener('click', () => {
      safeReload();
    });

    document.getElementById('autoToggleBtn').addEventListener('click', () => {
      const currentlyOn = localStorage.getItem(localStorageKey) === 'true';
      localStorage.setItem(localStorageKey, (!currentlyOn).toString());
      updateAutoModeButton();
      alert(`Auto Mode is now ${!currentlyOn ? 'ENABLED' : 'DISABLED'}.`);
      if (!currentlyOn) runAutoIfEnabled();
    });

    runAutoIfEnabled();
  });
})();
