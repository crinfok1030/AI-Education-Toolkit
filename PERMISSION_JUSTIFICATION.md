# Chrome Web Store - Permission Justification

## Storage Permission Justification

### Single Permission Required: `storage`

**Why we need it:**

The `storage` permission is required to save your timer state locally on your device. This enables the following essential features:

1. **Persistent Timer** - Your essay timer continues running even if you close the extension popup. Without storage permission, the timer would reset every time you reopen the extension.

2. **Remember Your Settings** - The extension remembers which task type (Task 1 or Task 2) you selected, so you don't have to reconfigure it every time.

3. **Resume After Browser Restart** - If you accidentally close your browser while the timer is running, the extension can calculate the elapsed time and resume from where you left off.

**What data is stored:**
- Current timer countdown value (in seconds)
- Selected task preset (20 or 40 minutes)
- Timer running state (started/paused)

**What is NOT stored:**
- Your essay text or any writing content
- Personal information
- Browsing history
- Any data from other websites

**Privacy guarantee:**
All data is stored locally on your device only. Nothing is ever transmitted to external servers or collected by us. The storage permission is used exclusively for timer functionality.

---

## Short Version (for submission form)

**Required for timer persistence only.** 

Saves timer state locally so your countdown continues even when you close the popup. Stores: timer value, selected task type, and running status. Does NOT store any of your writing content or personal data. All data remains on your device - nothing is sent to external servers.

---

## Even Shorter Version (if character limit)

Saves timer state locally on your device so the countdown persists when you close/reopen the extension. No personal data or essay content is stored.
