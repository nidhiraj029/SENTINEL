const API = "http://127.0.0.1:8000";

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  if (/^(chrome|edge|about|chrome-extension):\/\//.test(tab.url)) return;

  try {
    const result = await fetch(`${API}/api/analyze`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({url: tab.url})
    }).then(r => r.json());

    await chrome.storage.local.set({
      [`scan_${tabId}`]: result,
      sentinel_last_result: result
    });

    if (result.score >= 76) {
      try {
        await chrome.tabs.sendMessage(tabId, {
          type: "SENTINEL_WARNING",
          result
        });
      } catch (_) {}
    }
  } catch (_) {}
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`scan_${tabId}`);
});
