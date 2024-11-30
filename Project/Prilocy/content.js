function findPrivacyPolicyLink() {
    // Get all links on the page
    const links = document.querySelectorAll('a');
    for (let link of links) {
      const href = link.href.toLowerCase();
      const text = link.textContent.toLowerCase();
  
      // Check if the link or its text contains "privacy"
      if (href.includes('privacy') || text.includes('privacy')) {
        return link.href; // Return the first likely privacy policy link found
      }
    }
    return null; // No link found
  }

function sendPrivacyPolicy(privacyURL){
  // change that later
  const data = {
      "url": privacyURL
  }
  var resumed = fetch("http://127.0.0.1:5000/summarize", {
      method: 'POST', // Specify the HTTP method
      headers: {
          'Content-Type': 'application/json' // Specify content type for JSON payload
      },
      body: JSON.stringify(data) // Convert data to JSON string
      })
      .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse the JSON response
      })
      .then(data => {
      })
      .catch(error => {
      console.error('Error:', error); // Log any error
  });
  console.log(resumed);
  return resumed;
}

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "findPrivacyPolicy") {
      const privacyPolicyUrl = findPrivacyPolicyLink();
      sendResponse({ url: privacyPolicyUrl });
    }

    if (message.command === "sendPrivacyPolicy") {
      const response = sendPrivacyPolicy(message.url);
      sendResponse({ summary: response });
    }

  });

  
