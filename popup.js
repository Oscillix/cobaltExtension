document.addEventListener('DOMContentLoaded', function () {
    const urlInput = document.getElementById('url');
    const autoBtn = document.getElementById('auto-btn');
    const audioBtn = document.getElementById('audio-btn');
    const download = document.getElementById('download-btn');
    const form = document.getElementById('download-form');
    const settingsBtn = document.getElementById('settings-btn');
    const statusLbl = document.getElementById('statuslabel');
    const result = document.getElementById('result');

    // Set current tab URL as input value
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        urlInput.value = tabs[0].url;
    });

    autoBtn.addEventListener('click', function () {
        autoBtn.classList.add('active');
        audioBtn.classList.remove('active');
    });

    audioBtn.addEventListener('click', function () {
        audioBtn.classList.add('active');
        autoBtn.classList.remove('active');
    });

    settingsBtn.addEventListener('click', function () {
        chrome.runtime.openOptionsPage();
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const url = urlInput.value;
        const isAudioOnly = audioBtn.classList.contains('active');

        chrome.storage.sync.get(['quality', 'format', 'codec'], function (data) {
            const requestBody = {
                url: url,
                vCodec: data.codec || 'h264',
                vQuality: data.quality || '720',
                aFormat: data.format || 'best',
                isAudioOnly: isAudioOnly
            };

            // result.textContent = "Getting url from cobalt...";
            download.textContent = "Getting url from cobalt..."
            fetch('https://api.cobalt.tools/api/json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success' || data.status === 'stream') {
                        download.textContent = "Success, downloading!"
                        window.location = data.url
                        setTimeout(function(){
                            download.textContent = "\uD83D\uDCBE Download";
                        }, 5000);
                    } else {
                        console.warn(data.status)
                        download.textContent = "\uD83D\uDCBE Download";
                        result.textContent = `Cobalt API Returned ${data.status}: ${data.text}`;
                        setTimeout(function(){
                            result.textContent = "";
                        }, 10000);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    });
});
