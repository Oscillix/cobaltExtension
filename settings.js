document.addEventListener('DOMContentLoaded', function () {
    const qualityBtns = document.querySelectorAll('.quality-btn');
    const formatBtns = document.querySelectorAll('.format-btn');
    const codecBtns = document.querySelectorAll('.codec-btn');
    const saveBtn = document.getElementById('save-btn');

    chrome.storage.sync.get(['quality', 'format', 'codec'], function (data) {
        if (data.quality) {
            document.querySelector(`.quality-btn[data-quality="${data.quality}"]`).classList.add('active');
        }
        if (data.format) {
            document.querySelector(`.format-btn[data-format="${data.format}"]`).classList.add('active');
        }
        if (data.codec) {
            document.querySelector(`.codec-btn[data-codec="${data.codec}"]`).classList.add('active');
        }
    });

    qualityBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            qualityBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    formatBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            formatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    codecBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            codecBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    saveBtn.addEventListener('click', function () {
        const quality = document.querySelector('.quality-btn.active').dataset.quality;
        const format = document.querySelector('.format-btn.active').dataset.format;
        const codec = document.querySelector('.codec-btn.active').dataset.codec;

        chrome.storage.sync.set({ quality: quality, format: format, codec: codec }, function () {
            window.close();
        });
    });
});
