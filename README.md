# 🚫 Automatic Unfollow on CB

A Tampermonkey userscript that unfollows all followed cams on CB — one by one, reliably, with full UI control and optional auto mode.

Built for users with **hundreds or even thousands of follows**, this script automates the unfollow process while staying within CB's site limits.

---

## ⚙️ Features

- ✅ **Start / Stop** unfollowing at any time
- ✅ **Unfollows 1 cam per second** to avoid triggering rate limits
- ✅ **Auto-refresh** after each batch of 90 cams
- ✅ **Auto Mode** toggle for hands-off operation
- ✅ **Safe reloads** even when tab is inactive
- ✅ Floating control panel (bottom right)
- ✅ Spinner + Remaining unfollow count

---

## 📥 How to Install

1. Install the **Tampermonkey** extension:
   - [Chrome](https://tampermonkey.net/?ext=dhdg&browser=chrome)
   - [Firefox](https://tampermonkey.net/?ext=dhdg&browser=firefox)
2. Open Tampermonkey dashboard
3. Click **"Create a new script"**
4. Replace the template with the contents of [`cb-unfollow-manager.user.js`](./cb-unfollow-manager.user.js)
5. Save the script
6. Go to your [Followed Cams page](https://chaturbate.com/followed-cams) and start unfollowing!

---

## 💡 Notes

- The script unfollows **one cam per second**. For large accounts, be patient.
- CB may **rate-limit** excessive requests (especially after ~300–500 unfollows).
- If unfollows stop working, **wait 5–10 minutes**, then resume.
- Use the **"Auto Mode"** toggle for hands-off cleanup.

---

## 🛠 Customization

You can edit these constants in the script to fine-tune behavior:

```javascript
const unfollowDelay = 1000; // Time between unfollows (in ms)
const postUnfollowWait = 2000; // Time to wait before page refresh
