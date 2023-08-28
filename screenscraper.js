const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const desktopPath = path.join(require('os').homedir(), 'Desktop');

async function takeScreenshot() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = 'https://roomcheck-git-updatedproduction-ekat-br.vercel.app/teacher'; 
  await page.goto(url, { waitUntil: 'domcontentloaded' });


  await autoScroll(page);

  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const screenshotPath = path.join(desktopPath, `screenshot-${timestamp}.png`);

 
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await browser.close();
}

async function autoScroll(page){
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function main() {
  try {
    setInterval(async () => {
      await takeScreenshot();
      console.log('Screenshot captured and saved.');
    }, 30000);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
