const puppeteer = require('puppeteer');
const ObjectsToCsv = require('objects-to-csv');

async function scrapeProducts(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('.ResultsList');

  let products = await page.$$('#SKUDetailsDiv');
  let scrapedData = [];
  const category = await page.$eval('.current', element => element.textContent);

  for(let i=0; i<10; i++) {
    const product = products[i];
    const productName = await product.$eval('.sku-description', element => element.textContent);
    const productPrice = await product.$eval('#SkuPriceUpdate', element => element.textContent);
    const itemNumber = await product.$eval('.lblItemNo', element => element.textContent);
    const modelNumber = await product.$eval('.model-number', element => element.textContent);
    const description = await product.$eval('.skuBrowseBullets', element => element.textContent);
    
    scrapedData.push({
      productName,
      productPrice,
      itemNumber,
      modelNumber,
      description,
      category
    })
  }

  console.log('scrapedData ', scrapedData);
  exportToCSV(scrapedData);
  browser.close();
}

const exportToCSV = async (data) => {
  const csv = new ObjectsToCsv(data);
  await csv.toDisk('./products.csv');
  
  // Return the CSV file as string:
  console.log(await csv.toString());
} 

scrapeProducts('https://www.quill.com/hanging-file-folders/cbk/122567.html');