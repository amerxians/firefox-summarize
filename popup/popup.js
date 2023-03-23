// Add a listener for the summarize message from the background script
document.getElementById('summarize-btn').addEventListener('click', () => {
  const summaryText = document.getElementById('summary-text');
  const errorMessage = document.getElementById('error-message');
  const apiKeyDiv = document.getElementById('api-key');
  const apiKeyInput = document.getElementById('input-api-key');

  summaryText.innerHTML = 'Summarizing...';
  errorMessage.classList.add('hidden');

  // Send a message to the background script to start summarization
  browser.runtime.sendMessage({ type: 'summarize' })
    .then(response => {
      if (response.error) {
        summaryText.innerHTML = '';
        errorMessage.textContent = `Error: ${response.error}`;
        errorMessage.classList.remove('hidden');
        if (response.missingApiKey) {
          errorMessage.classList.remove('hidden');
          apiKeyDiv.classList.remove('hidden');
          apiKeyInput.focus();
        }
      } else {
        // Replace line breaks with <br> tags
        response.summary = response.summary.replace(/\n/g, '<br/>');
        summaryText.innerHTML = response.summary;
        errorMessage.classList.add('hidden');
      }
    });
});

// Add a listener for the setApiKey message from the background script
document.getElementById('send-api-key').addEventListener('click', () => {
  const apiKeyDiv = document.getElementById('api-key');
  const apiKeyInput = document.getElementById('input-api-key');
  const errorMessage = document.getElementById('error-message');
  const summaryText = document.getElementById('summary-text');


  browser.runtime.sendMessage({ type: 'setApiKey', apiKey: apiKeyInput.value })
    .then((response) => {
      apiKeyInput.value = '';
      
      if (response.error) {
        errorMessage.textContent = `Error: ${response.error}`;
        errorMessage.classList.remove('hidden');
      } else {
        errorMessage.classList.add('hidden');
        apiKeyDiv.classList.add('hidden');
        summaryText.innerHTML = 'API key set successfully!';
      }
    });
});

// Add a listener for the settings button
document.getElementById('settings-btn').addEventListener('click', () => {
  const settingsDiv = document.getElementById('settings');
  const mainDiv = document.getElementById('main-container');

  if (settingsDiv.classList.contains('hidden')) {
    settingsDiv.classList.remove('hidden');
    mainDiv.classList.add('hidden');
  }
  else {
    settingsDiv.classList.add('hidden');
    mainDiv.classList.remove('hidden');
  }
});

// Add a listener for changes to the font family
document.getElementById('font-family-input').addEventListener('change', (event) => {
  // Change the font family for the body
  document.body.style.fontFamily = event.target.value;
  browser.storage.local.set({ fontFamily: event.target.value });
});

// Add a listener for changes to the font size
document.getElementById('font-size-input').addEventListener('change', (event) => {
  // Change the font size for the body
  document.body.style.fontSize = event.target.value + 'pt';
  browser.storage.local.set({ fontSize: event.target.value });
});

// Get the font settings from storage and apply them
browser.storage.local.get(['fontSize', 'fontFamily']).then((result) => {
  if (result.fontSize) {
    document.body.style.fontSize = result.fontSize + 'pt';
    document.getElementById('font-size-input').value = result.fontSize;
  }
  if (result.fontFamily) {
    document.body.style.fontFamily = result.fontFamily;
    document.getElementById('font-family-input').value = result.fontFamily;
  }
});