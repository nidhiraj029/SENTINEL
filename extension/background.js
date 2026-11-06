const API = "http://127.0.0.1:8000";

function isSupportedUrl(url) {
  if (!url) return false;
  return !/^(chrome|edge|about|chrome-extension|devtools|view-source):\/\//i.test(url);
}

function updateBadge(tabId, result) {
  if (!tabId || !result) {
    chrome.action.setBadgeText({ tabId, text: "" });
    return;
  }
  const score = result.score ?? 0;
  let color = "#22c55e"; // green
  let text = "OK";
  if (score >= 76) {
    color = "#ef4444"; // red
    text = "!";
  } else if (score >= 51) {
    color = "#f97316"; // orange
    text = `${score}`;
  } else if (score >= 31) {
    color = "#eab308"; // yellow
    text = `${score}`;
  } else if (score > 0) {
    text = `${score}`;
  }
  chrome.action.setBadgeText({ tabId, text });
  chrome.action.setBadgeBackgroundColor({ tabId, color });
  chrome.action.setTitle({
    tabId,
    title: `SENTINEL: ${result.level || 'SCAN'} (${score}/100)`
  });
}

async function analyzeTab(tabId, payload) {
  const url = typeof payload === "string" ? payload : payload.url;
  if (!isSupportedUrl(url)) return null;

  const bodyData = typeof payload === "object" ? payload : { url };

  try {
    const response = await fetch(`${API}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const result = await response.json();

    await chrome.storage.local.set({
      [`scan_${tabId}`]: result,
      sentinel_last_result: result
    });

    updateBadge(tabId, result);

    try {
      await chrome.tabs.sendMessage(tabId, {
        type: "SENTINEL_SCAN_RESULT",
        result: result
      });
    } catch (_) {}

    return result;
  } catch (error) {
    console.warn("SENTINEL background scan:", error.message);
    return null;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SENTINEL_CONTENT_SIGNALS") {
    const tabId = sender.tab?.id;
    if (tabId && message.payload) {
      analyzeTab(tabId, message.payload).then(res => {
        sendResponse({ success: true, result: res });
      });
      return true;
    }
  } else if (message.type === "SENTINEL_GET_TAB_RESULT") {
    const tabId = message.tabId;
    chrome.storage.local.get([`scan_${tabId}`, "sentinel_last_result"], (items) => {
      sendResponse({ result: items[`scan_${tabId}`] || items.sentinel_last_result });
    });
    return true;
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  if (!isSupportedUrl(tab.url)) return;

  await analyzeTab(tabId, { url: tab.url });
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const items = await chrome.storage.local.get([`scan_${activeInfo.tabId}`]);
    const res = items[`scan_${activeInfo.tabId}`];
    if (res) {
      updateBadge(activeInfo.tabId, res);
    }
  } catch (_) {}
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`scan_${tabId}`);
});
