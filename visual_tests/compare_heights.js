const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    async function getSectionHeights(url) {
        if (url.includes('ngrok')) {
            await page.setExtraHTTPHeaders({ 'ngrok-skip-browser-warning': '1' });
        }
        await page.goto(url, { waitUntil: 'load' });
        // Let dynamic things render
        await page.waitForTimeout(5000);

        return await page.evaluate(() => {
            const sections = document.querySelectorAll('main.main-content .shopify-section, main#MainContent .shopify-section');
            const data = {};
            sections.forEach((sec, idx) => {
                let id = sec.id || `section_${idx}`;
                // Strip shopify-section-template--[number]__ prefix
                id = id.replace(/shopify-section-template--\d+__/, '');
                data[id] = sec.getBoundingClientRect().height;
            });
            return data;
        });
    }

    const prodHeights = await getSectionHeights('https://playlovetoys.ca');
    const localHeights = await getSectionHeights('https://monkey-tight-lab.ngrok-free.app');

    console.log("Section Heights COMPARISON:\n");
    const allIds = new Set([...Object.keys(prodHeights), ...Object.keys(localHeights)]);

    for (const id of allIds) {
        const prod = prodHeights[id] || 0;
        const local = localHeights[id] || 0;
        const diff = local - prod;
        console.log(`${id.padEnd(50)} DEPLOY: ${prod}px | LOCAL: ${Math.round(local)}px | DIFF: ${Math.round(diff)}px`);
    }

    await browser.close();
})();
