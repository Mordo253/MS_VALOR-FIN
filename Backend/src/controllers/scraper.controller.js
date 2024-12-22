import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import FinancialData from '../models/scraping.model.js';

// Utilidad para esperar por selectores
const waitForSelector = async (page, selector, timeout = 5000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    console.error(`Timeout waiting for selector: ${selector}`);
    return false;
  }
};

// Definición de scrapers para cada indicador
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

// Función para verificar si se debe actualizar
const shouldUpdate = async () => {
  const now = new Date();
  const hour = now.getHours();
  
  // Solo actualizar a las 8am
  if (hour !== 8) {
    return false;
  }

  // Verificar si ya se actualizó hoy
  const latestUpdate = await FinancialData.findOne()
    .sort({ updatedAt: -1 });

  if (!latestUpdate) return true;

  const lastUpdateDate = new Date(latestUpdate.updatedAt);
  const today = new Date();

  return lastUpdateDate.getDate() !== today.getDate() ||
         lastUpdateDate.getMonth() !== today.getMonth() ||
         lastUpdateDate.getFullYear() !== today.getFullYear();
};

// Función principal de scraping
const scrapeAllData = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    const allResults = [];

    for (const [key, scraper] of Object.entries(scrapers)) {
      try {
        console.log(`Scraping data for ${key}...`);
        const dataArray = await scraper(page);
        allResults.push(...dataArray);
        console.log(`Scraped data for ${key}:`, dataArray);
      } catch (error) {
        console.error(`Error scraping ${key}:`, error);
      }
    }

    return allResults;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};

// Función para actualizar los datos financieros
const updateFinancialData = async (req, res) => {
  try {
    const shouldUpdateToday = await shouldUpdate();
    
    if (!shouldUpdateToday) {
      const allData = await FinancialData.find({});
      return res.json({ 
        message: 'Data was already updated today. Using existing data.',
        data: allData 
      });
    }

    // Obtener datos existentes
    const existingData = await FinancialData.find({});
    const existingPrices = new Map(
      existingData.map(item => [item.symbol, item.price])
    );

    // Realizar scraping
    const scrapedData = await scrapeAllData();

    // Actualizar registros
    const updatePromises = scrapedData
      .filter(item => item && item.price !== null)
      .map(async item => {
        const previousPrice = existingPrices.get(item.symbol) || item.price;
        const change = item.price - previousPrice;
        const percentChange = ((item.price - previousPrice) / previousPrice) * 100;

        return FinancialData.findOneAndUpdate(
          { symbol: item.symbol },
          {
            ...item,
            previousPrice,
            change,
            percentChange,
            source: 'La República',
            updatedAt: new Date(),
            updatePeriod: 'morning'
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
    
    console.log('All data updated successfully');
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

// Función para obtener los datos financieros
const getFinancialData = async (req, res) => {
  try {
    const allData = await FinancialData.find({});
    res.json(allData);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ 
      error: 'Error fetching financial data', 
      details: error.message 
    });
  }
};

// Función para iniciar el scraper automáticamente
const startAutomaticScraper = async () => {
  try {
    // Verificar la hora actual
    const now = new Date();
    const targetHour = 8; // 8 AM
    
    // Calcular el tiempo hasta la próxima actualización
    let nextUpdate = new Date(now);
    nextUpdate.setHours(targetHour, 0, 0, 0);
    
    if (now.getHours() >= targetHour) {
      nextUpdate.setDate(nextUpdate.getDate() + 1);
    }
    
    const timeUntilNextUpdate = nextUpdate - now;
    
    // Programar la próxima actualización
    setTimeout(async () => {
      await scrapeAllData();
      startAutomaticScraper(); // Programar la siguiente actualización
    }, timeUntilNextUpdate);
    
    console.log(`Next update scheduled for: ${nextUpdate}`);
  } catch (error) {
    console.error('Error in automatic scraper:', error);
    // Reintentar en 1 hora en caso de error
    setTimeout(startAutomaticScraper, 3600000);
  }
};

// Exportar todas las funciones necesarias
export { 
  scrapeAllData, 
  getFinancialData,
  updateFinancialData,
  startAutomaticScraper 
};