const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    async function getFooterText(url) {
        if (url.includes('ngrok')) {
            await page.setExtraHTTPHeaders({ 'ngrok-skip-browser-warning': '1' });
        }
        await page.goto(url, { waitUntil: 'load' });
        await page.waitForTimeout(3000);
        return await page.evaluate(() => {
            const footer = document.querySelector('footer.footer');
            return footer ? footer.innerText.replace(/\n+/g, ' | ') : 'NO FOOTER';
        });
    }

    const prodText = await getFooterText('https://playlovetoys.ca');
    const localText = await getFooterText('https://monkey-tight-lab.ngrok-free.app');
    console.log("PROD TEXT:\n", prodText.substring(0, 1000));
    console.log("\nLOCAL TEXT:\n", localText.substring(0, 1000));

    await browser.close();
})();
