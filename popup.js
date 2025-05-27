document.getElementById("loginButton").addEventListener("click", async () => {
  // Get the current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if we're on LeetCode
  if (!tab.url.includes("leetcode.com")) {
    // If not on LeetCode, navigate to LeetCode
    await chrome.tabs.update(tab.id, { url: "https://leetcode.com" });
    window.close();
    return;
  }

  // Execute the login automation script
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: automateLogin,
  });

  window.close();
});

// This function will be injected into the LeetCode page
function automateLogin() {
  window.location.href =
    "https://leetcode.com/accounts/google/login/?next=%2Fproblemset%2F";
}
