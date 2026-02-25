const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'ngrok-skip-browser-warning': '1' });
    await page.goto('https://monkey-tight-lab.ngrok-free.app', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const dim = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.b-carousel-item'));
        return items.map(el => ({
            visible: el.offsetHeight > 0,
            width: el.getBoundingClientRect().width,
            height: el.getBoundingClientRect().height,
            display: window.getComputedStyle(el).display,
            position: window.getComputedStyle(el).position
        }));
    });
    console.log(dim);
    await browser.close();
})();
