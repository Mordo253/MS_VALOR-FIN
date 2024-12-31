// controllers/scraper.controller.js
import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
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

const scrapers = {
  tasaUsura: async (page) => {
    console.log('Iniciando scraping de Tasa Usura');
    await page.goto('https://www.larepublica.co/indicadores-economicos/bancos/tasa-de-usura', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    const data = await page.evaluate(() => {
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
    console.log('Datos obtenidos Tasa Usura:', data);
    return data;
  },

  dtf: async (page) => {
    console.log('Iniciando scraping de DTF');
    await page.goto('https://www.larepublica.co/indicadores-economicos/bancos/dtf', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    const data = await page.evaluate(() => {
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
    console.log('Datos obtenidos DTF:', data);
    return data;
  },

  oro: async (page) => {
    console.log('Iniciando scraping de Oro');
    await page.goto('https://www.larepublica.co/indicadores-economicos/commodities/oro', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    const data = await page.evaluate(() => {
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
    console.log('Datos obtenidos Oro:', data);
    return data;
  },

  petroleo: async (page) => {
    console.log('Iniciando scraping de Petróleo');
    await page.goto('https://www.larepublica.co/indicadores-economicos/commodities/petroleo', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    const data = await page.evaluate(() => {
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
    console.log('Datos obtenidos Petróleo:', data);
    return data;
  },

  dolar: async (page) => {
    console.log('Iniciando scraping de Dólar');
    await page.goto('https://www.larepublica.co/indicadores-economicos/mercado-cambiario/dolar', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    const data = await page.evaluate(() => {
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
    console.log('Datos obtenidos Dólar:', data);
    return data;
  },

  ipc: async (page) => {
    console.log('Iniciando scraping de IPC');
    await page.goto('https://www.larepublica.co/indicadores-economicos/macro/ipc', { waitUntil: 'networkidle0' });
    await waitForSelector(page, '.price');
    const data = await page.evaluate(() => {
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
    console.log('Datos obtenidos IPC:', data);
    return data;
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
  let browser;
  try {
    console.log('Iniciando proceso de scraping general');
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    const allResults = [];
    for (const [key, scraper] of Object.entries(scrapers)) {
      try {
        console.log(`Ejecutando scraper para ${key}...`);
        const dataArray = await scraper(page);
        allResults.push(...dataArray);
        console.log(`Scraping de ${key} completado:`, dataArray);
      } catch (error) {
        console.error(`Error en scraping de ${key}:`, error);
      }
    }
    console.log('Proceso de scraping completado');
    return allResults;
  } finally {
    if (browser) await browser.close();
  }
};

const getFinancialData = async (req, res) => {
  try {
    console.log(`[${new Date().toLocaleString()}] Solicitando datos financieros`);
    const data = await FinancialData.find({}).sort({ updatedAt: -1 });
    console.log(`Datos obtenidos: ${data.length} registros`);
    res.json(data);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
};

const updateFinancialData = async (req, res) => {
  console.log(`[${new Date().toLocaleString()}] Iniciando actualización de datos financieros`);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Obtener datos existentes
    const existingData = await FinancialData.find({}).session(session);
    const existingDataMap = new Map(existingData.map(item => [item.symbol, item]));

    // Realizar scraping de nuevos datos
    const scrapedData = await scrapeAllData();

    // Procesar y actualizar datos
    const updatePromises = scrapedData
      .filter(item => item && item.price !== null)
      .map(async item => {
        const existing = existingDataMap.get(item.symbol);
        
        // Si no hay datos existentes, el precio actual será también el precio previo
        const previousPrice = existing ? existing.price : item.price;
        
        // Calcular cambios
        const priceChange = parseFloat((item.price - previousPrice).toFixed(2));
        const pricePercentChange = parseFloat(((item.price - previousPrice) / previousPrice * 100).toFixed(2));

        return FinancialData.findOneAndUpdate(
          { symbol: item.symbol },
          {
            ...item,
            previousPrice,
            change: priceChange,
            percentChange: pricePercentChange,
            source: 'La República',
            updatedAt: new Date()
          },
          { 
            upsert: true, 
            new: true,
            session,
            setDefaultsOnInsert: true 
          }
        );
    });

    const results = await Promise.all(updatePromises);
    await session.commitTransaction();
    
    console.log(`Actualización completada: ${results.length} registros actualizados`);
    res.json({ 
      message: 'Update completed',
      data: results 
    });
  } catch (error) {
    console.error('Error en actualización:', error);
    await session.abortTransaction();
    res.status(500).json({ error: 'Update failed', details: error.message });
  } finally {
    session.endSession();
  }
};

export {
  scrapeAllData,
  getFinancialData,
  updateFinancialData
};