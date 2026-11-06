const API = "http://127.0.0.1:8000";

function isSupportedUrl(url) {
  if (!url) return false;

  return !/^(chrome|edge|about|chrome-extension|devtools):\/\//i.test(url);
}

async function analyzeTab(tabId, url) {
  if (!isSupportedUrl(url)) return;

  try {
    const response = await fetch(`${API}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const result = await response.json();

    await chrome.storage.local.set({
      [`scan_${tabId}`]: result,
      sentinel_last_result: result
    });

    // Tell the content script about the result.
    try {
      await chrome.tabs.sendMessage(tabId, {
        type: "SENTINEL_SCAN_RESULT",
        result: result
      });
    } catch (_) {
      // Content script may not be ready on restricted pages.
    }

  } catch (error) {
    console.error("SENTINEL scan failed:", error);
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url) return;

  await analyzeTab(tabId, tab.url);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`scan_${tabId}`);
});
