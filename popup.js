// Constants
const LEETCODE_BASE_URL = "https://leetcode.com";
const LEETCODE_LOGIN_URL = "https://leetcode.com/accounts/google/login/";

// Main functionality
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");
  loginButton.addEventListener("click", handleLoginClick);
});

async function handleLoginClick() {
  try {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) {
      console.error("No active tab found");
      return;
    }

    // Check if we're on LeetCode
    if (!isLeetCodeTab(tab.url)) {
      // If not on LeetCode, navigate to LeetCode
      await chrome.tabs.update(tab.id, { url: LEETCODE_BASE_URL });
      window.close();
      return;
    }

    // Execute the login automation script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [tab.url],
      function: redirectToGoogleLogin,
    });

    window.close();
  } catch (error) {
    console.error("Error during login process:", error);
  }
}

function isLeetCodeTab(url) {
  return url && url.includes("leetcode.com");
}

// Content script function - will be injected into the page
function redirectToGoogleLogin(currentUrl) {
  try {
    const urlParts = currentUrl.split("leetcode.com");
    const redirectPath = urlParts.length > 1 ? urlParts[1] : "/";
    const redirectUrl = encodeURIComponent(redirectPath);
    const loginUrl = `https://leetcode.com/accounts/google/login/?next=${redirectUrl}`;

    window.location.href = loginUrl;
  } catch (error) {
    console.error("Error redirecting to login:", error);
  }
}
