import puppeteer from 'puppeteer';
import FinancialData from '../models/scraping.model.js';

const waitForSelector = async (page, selector, timeout = 5000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    console.error(`Timeout waiting for selector: ${selector}`);
    return false;
  }
};

// const shouldUpdate = async () => {
//   try {
//     const lastUpdate = await FinancialData.findOne({}, {}, { sort: { 'updatedAt': -1 } });
    
//     if (!lastUpdate) {
//       return true;
//     }

//     const lastUpdateDate = new Date(lastUpdate.updatedAt);
//     const today = new Date();

//     return lastUpdateDate.getDate() !== today.getDate() ||
//            lastUpdateDate.getMonth() !== today.getMonth() ||
//            lastUpdateDate.getFullYear() !== today.getFullYear();
//   } catch (error) {
//     console.error('Error checking last update:', error);
//     return false;
//   }
// };

const scrapers = {
  tasaUsura: async (page) => {
    await page.goto('https://www.larepublica.co/indicadores-economicos/bancos/tasa-de-usura', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    return page.evaluate(() => {
      const price = document.querySelector('.price')?.textContent.trim();
      const change = document.querySelector('.change')?.textContent.trim();
      const percentChange = document.querySelector('.percent-change')?.textContent.trim();
      const date = document.querySelector('.date')?.textContent.trim();
      return [{
        symbol: 'TASA_USURA',
        name: 'Tasa de Usura',
        price: price ? parseFloat(price.replace('%', '')) : null,
        change: change ? parseFloat(change.replace('%', '')) : null,
        percentChange: percentChange ? parseFloat(percentChange.replace('%', '')) : null,
        date: date
      }];
    });
  },
  dtf: async (page) => {
    await page.goto('https://www.larepublica.co/indicadores-economicos/bancos/dtf', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    return page.evaluate(() => {
      const price = document.querySelector('.price')?.textContent.trim();
      const change = document.querySelector('.percent-change')?.textContent.trim();
      const period = document.querySelector('.period')?.textContent.trim();
      return [{
        symbol: 'DTF',
        name: 'DTF',
        price: price ? parseFloat(price.replace('%', '')) : null,
        change: change ? parseFloat(change.replace('%', '')) : null,
        percentChange: change ? parseFloat(change.replace('%', '')) : null,
        period: period
      }];
    });
  },
  oro: async (page) => {
    await page.goto('https://www.larepublica.co/indicadores-economicos/commodities/oro', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    return page.evaluate(() => {
      const price = document.querySelector('.price')?.textContent.trim();
      const change = document.querySelector('.change')?.textContent.trim();
      const percentChange = document.querySelector('.percent-change')?.textContent.trim();
      const date = document.querySelector('.date')?.textContent.trim();
      return [{
        symbol: 'ORO',
        name: 'Oro',
        price: price ? parseFloat(price.replace('US$', '').replace(/\./g, '').replace(',', '.')) : null,
        change: change ? parseFloat(change.replace('US$', '')) : null,
        percentChange: percentChange ? parseFloat(percentChange.replace('%', '')) : null,
        date: date
      }];
    });
  },
  petroleo: async (page) => {
    await page.goto('https://www.larepublica.co/indicadores-economicos/commodities/petroleo', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    return page.evaluate(() => {
      const price = document.querySelector('.price')?.textContent.trim();
      const change = document.querySelector('.change')?.textContent.trim();
      const percentChange = document.querySelector('.percent-change')?.textContent.trim();
      const date = document.querySelector('.date')?.textContent.trim();
      return [{
        symbol: 'PETROLEO_WTI',
        name: 'Petróleo WTI',
        price: price ? parseFloat(price.replace('US$', '')) : null,
        change: change ? parseFloat(change.replace('US$', '')) : null,
        percentChange: percentChange ? parseFloat(percentChange.replace('%', '')) : null,
        date: date
      }];
    });
  },
  dolar: async (page) => {
    await page.goto('https://www.larepublica.co/indicadores-economicos/mercado-cambiario/dolar', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    return page.evaluate(() => {
      const price = document.querySelector('.price')?.textContent.trim();
      const change = document.querySelector('.change')?.textContent.trim();
      const percentChange = document.querySelector('.percent-change')?.textContent.trim();
      const openPrice = document.querySelector('.open-price')?.textContent.trim();
      const avgPrice = document.querySelector('.avg-price')?.textContent.trim();
      const maxPrice = document.querySelector('.max-price')?.textContent.trim();
      const minPrice = document.querySelector('.min-price')?.textContent.trim();
      const transactions = document.querySelector('.transactions')?.textContent.trim();
      return [{
        symbol: 'USD/COP',
        name: 'Dólar Spot',
        price: price ? parseFloat(price.replace('$', '').replace(/\./g, '').replace(',', '.')) : null,
        change: change ? parseFloat(change.replace('$', '').replace(/\./g, '').replace(',', '.')) : null,
        percentChange: percentChange ? parseFloat(percentChange.replace('%', '')) : null,
        openPrice: openPrice ? parseFloat(openPrice.replace('$', '').replace(/\./g, '').replace(',', '.')) : null,
        avgPrice: avgPrice ? parseFloat(avgPrice.replace('$', '').replace(/\./g, '').replace(',', '.')) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice.replace('$', '').replace(/\./g, '').replace(',', '.')) : null,
        minPrice: minPrice ? parseFloat(minPrice.replace('$', '').replace(/\./g, '').replace(',', '.')) : null,
        transactions: transactions ? parseInt(transactions.replace(/\./g, '')) : null
      }];
    });
  },
  ipc: async (page) => {
    await page.goto('https://www.larepublica.co/indicadores-economicos/macro/ipc', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    return page.evaluate(() => {
      const price = document.querySelector('.price')?.textContent.trim();
      const change = document.querySelector('.change')?.textContent.trim();
      const percentChange = document.querySelector('.percent-change')?.textContent.trim();
      const date = document.querySelector('.date')?.textContent.trim();
      return [{
        symbol: 'IPC',
        name: 'IPC',
        price: price ? parseFloat(price.replace('%', '')) : null,
        change: change ? parseFloat(change.replace('%', '')) : null,
        percentChange: percentChange ? parseFloat(percentChange.replace('%', '')) : null,
        date: date
      }];
    });
  },
  uvr: async (page) => {
    await page.goto('https://www.larepublica.co/indicadores-economicos/bancos/uvr', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    return page.evaluate(() => {
      const price = document.querySelector('.price')?.textContent.trim();
      const change = document.querySelector('.change')?.textContent.trim();
      const percentChange = document.querySelector('.percent-change')?.textContent.trim();
      const date = document.querySelector('.date')?.textContent.trim();
      return [{
        symbol: 'UVR',
        name: 'UVR',
        price: price ? parseFloat(price.replace('$', '').replace(/\./g, '').replace(',', '.')) : null,
        change: change ? parseFloat(change.replace('$', '')) : null,
        percentChange: percentChange ? parseFloat(percentChange.replace('%', '')) : null,
        date: date
      }];
    });
  },
  euro: async (page) => {
    await page.goto('https://www.larepublica.co/indicadores-economicos/mercado-cambiario/euro', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    return page.evaluate(() => {
      const price = document.querySelector('.price')?.textContent.trim();
      const change = document.querySelector('.change')?.textContent.trim();
      const percentChange = document.querySelector('.percent-change')?.textContent.trim();
      const date = document.querySelector('.date')?.textContent.trim();
      const buyPrice = document.querySelector('.buy-price')?.textContent.trim();
      const sellPrice = document.querySelector('.sell-price')?.textContent.trim();
      return [{
        symbol: 'EUR/COP',
        name: 'Euro',
        price: price ? parseFloat(price.replace('$', '').replace(/\./g, '').replace(',', '.')) : null,
        change: change ? parseFloat(change.replace('$', '').replace(/\./g, '').replace(',', '.')) : null,
        percentChange: percentChange ? parseFloat(percentChange.replace('%', '')) : null,
        date: date,
        buyPrice: buyPrice ? parseFloat(buyPrice.replace('$', '').replace(/\./g, '').replace(',', '.')) : null,
        sellPrice: sellPrice ? parseFloat(sellPrice.replace('$', '').replace(/\./g, '').replace(',', '.')) : null
      }];
    });
  }
};

const scrapeAllData = async () => {
  const shouldUpdateToday = await shouldUpdate();
  if (!shouldUpdateToday) {
    console.log('Data was already updated today. Skipping update.');
    return false;
  }

  let browser;
  try {
    browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    for (const [key, scraper] of Object.entries(scrapers)) {
      try {
        console.log(`Scraping data for ${key}...`);
        const dataArray = await scraper(page);
        console.log(`Scraped data for ${key}:`, dataArray);

        for (const data of dataArray) {
          if (data && data.price !== null) {
            const result = await FinancialData.findOneAndUpdate(
              { symbol: data.symbol },
              {
                ...data,
                source: 'La República',
                updatedAt: new Date()
              },
              { upsert: true, new: true }
            );
            console.log(`Updated ${data.symbol} successfully:`, result.toObject());
          } else {
            console.warn(`Could not update ${data.symbol} due to missing data`);
          }
        }
      } catch (error) {
        console.error(`Error scraping or saving ${key}:`, error);
      }
    }

    console.log('All data update processes completed');
    return true;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};

// export const updateFinancialData = async (req, res) => {
//   try {
//     const shouldUpdateToday = await shouldUpdate();
//     if (!shouldUpdateToday) {
//       const allData = await FinancialData.find({});
//       return res.json({ 
//         message: 'Data was already updated today. Using existing data.', 
//         data: allData 
//       });
//     }

//     await scrapeAllData();
//     const allData = await FinancialData.find({});
//     console.log('All data in MongoDB:', allData);
//     res.json({ message: 'Data update completed successfully', data: allData });
//   } catch (error) {
//     console.error('Error in updateFinancialData:', error);
//     res.status(500).json({ error: 'Error updating financial data', details: error.message });
//   }
// };

export const updateFinancialData = async (req, res) => {
  try {
    const shouldUpdateToday = await shouldUpdate();
    
    if (!shouldUpdateToday) {
      const allData = await FinancialData.find({});
      return res.json({ 
        message: 'Data was already updated today. Using existing data.',
        data: allData 
      });
    }

    // Obtener datos existentes antes de la actualización
    const existingData = await FinancialData.find({});
    const existingPrices = new Map(
      existingData.map(item => [item.symbol, item.price])
    );

    // Obtener nuevos datos del scraper
    const scrapedData = await scrapeAllData();

    // Actualizar cada registro con cálculos de cambios
    const currentHour = new Date().getHours();
    const updatePromises = scrapedData.map(async item => {
      const previousPrice = existingPrices.get(item.symbol) || item.price;
      const change = item.price - previousPrice;
      const percentChange = ((item.price - previousPrice) / previousPrice) * 100;

      return FinancialData.findOneAndUpdate(
        { symbol: item.symbol },
        {
          $set: {
            name: item.name,
            price: item.price,
            previousPrice: previousPrice,
            change: change,
            percentChange: percentChange,
            source: item.source || 'scraper',
            updatedAt: new Date(),
            updatePeriod: currentHour < 12 ? 'morning' : 'afternoon'
          }
        },
        { 
          upsert: true, 
          new: true,
          setDefaultsOnInsert: true 
        }
      );
    });

    await Promise.all(updatePromises);
    const updatedData = await FinancialData.find({});
    
    console.log('All data in MongoDB:', updatedData);
    res.json({ 
      message: 'Data update completed successfully',
      data: updatedData 
    });

  } catch (error) {
    console.error('Error in updateFinancialData:', error);
    res.status(500).json({ 
      error: 'Error updating financial data', 
      details: error.message 
    });
  }
};

const shouldUpdate = async () => {
  const now = new Date();
  const hour = now.getHours();
  
  // Solo actualizar a las 8am y 6pm
  if (hour !== 8 && hour !== 18) {
    return false;
  }

  // Verificar si ya se actualizó en este período
  const latestUpdate = await FinancialData.findOne()
    .sort({ updatedAt: -1 });

  if (!latestUpdate) return true;

  const updateHour = new Date(latestUpdate.updatedAt).getHours();
  const updatePeriod = hour < 12 ? 'morning' : 'afternoon';

  // Evitar actualizaciones duplicadas en el mismo período
  return latestUpdate.updatePeriod !== updatePeriod;
};
const getFinancialData = async (req, res) => {
  try {
    const allData = await FinancialData.find({});
    res.json(allData);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ error: 'Error fetching financial data', details: error.message });
  }
};

export { scrapeAllData, getFinancialData };