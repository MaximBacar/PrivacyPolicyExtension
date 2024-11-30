// popup.js

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

  function getDomain(url) {
    try {
      const parsedUrl = new URL(url); 
      domain = parsedUrl.hostname; 
      if (domain.startsWith('www.')) {
        domain = domain.slice(4);
      }

      return domain;
      

    } catch (error) {
      console.error('Invalid URL:', error);
      return null; // Return null for invalid URLs
    }
  }
  const pageUrlTitle = document.getElementsByClassName('page-url');
  const activeTab = tabs[0]; // Get the active tab
  const url = activeTab.url; // Extract the URL
  var modUrl = getDomain(url);
  for (let title of pageUrlTitle) {
    title.textContent = `${modUrl}`;
  }
  
});


function sendPrivacyPolicy(privacyURL){
  // change that later
  const data = {
      "url": privacyURL
  }
  return fetch("http://127.0.0.1:5005/summarize", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
      })
      .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
      })
      .then(data => {
        return data; 
      })
      .catch(error => {
      console.error('Error:', error);
  });
}

document.addEventListener('DOMContentLoaded', function () {
    const findPolicyButton = document.getElementById('findPolicyButton');
    const resultElement = document.getElementById('result');
    const privacySummaryBox = document.getElementById('privacy-summary-box');
    const negativeSummaryBox = document.getElementById('negative-summary-box');
    const startScreen = document.getElementById('start-screen');
    const loader = document.getElementById("loading");
    const contentScreen = document.getElementById("content");
    const scoreElement = document.getElementById("score");
  
  
    if (findPolicyButton) {
      findPolicyButton.addEventListener('click', () => {
        // Send a message to the content script to find the privacy policy
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { command: "findPrivacyPolicy" }, (response) => {
            if (response.url) {
              findPolicyButton.style.display = 'none';
              loader.style.display = 'flex';

              sendPrivacyPolicy(response.url).then(data => {
                startScreen.style.display = 'none';
                contentScreen.style.display = 'inline';
                console.log('Privacy summary:', data); // Process the summary
                scoreElement.textContent = data['score'];
                data['points'].forEach(point =>{
                  const boxDiv = document.createElement('div');
                  boxDiv.classList.add('box');
                  // Create square box div
                  const squareBoxDiv = document.createElement('div');
                  squareBoxDiv.id = 'square-box';
                  // Create the square
                  const squareDiv = document.createElement('div');
                  squareDiv.id = 'square';
                  // Append square to square-box
                  squareBoxDiv.appendChild(squareDiv);
                  // Create a paragraph for the text
                  const textParagraph = document.createElement('p');
                  textParagraph.textContent = point['description'];
                  // Append square-box and paragraph to the box
                  boxDiv.appendChild(squareBoxDiv);
                  boxDiv.appendChild(textParagraph);
                  // Append the box to the negative-summary-box container
                  privacySummaryBox.appendChild(boxDiv);
                });

                data['negative_points'].forEach(point =>{
                  const boxDiv = document.createElement('div');
                  boxDiv.classList.add('box');
                  // Create square box div
                  const squareBoxDiv = document.createElement('div');
                  squareBoxDiv.id = 'square-box';
                  // Create the square
                  const squareDiv = document.createElement('div');
                  squareDiv.id = 'square';
                  // Append square to square-box
                  squareBoxDiv.appendChild(squareDiv);
                  // Create a paragraph for the text
                  const textParagraph = document.createElement('p');
                  textParagraph.textContent = point['description'];
                  // Append square-box and paragraph to the box
                  boxDiv.appendChild(squareBoxDiv);
                  boxDiv.appendChild(textParagraph);
                  // Append the box to the negative-summary-box container
                  negativeSummaryBox.appendChild(boxDiv);
                });

              })
              .catch(error => {
                console.error('An error occurred:', error);
              });
              
              

            } else {
              resultElement.textContent = 'Privacy Policy page not found.';
              resultElement.style.color = 'red';
            }
          });
        });
      });
    }
  });
  