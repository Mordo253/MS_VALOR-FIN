// controllers/scraper.controller.js
import puppeteer from 'puppeteer-core';  // Usamos puppeteer-core
import mongoose from 'mongoose';
import FinancialData from '../models/scraping.model.js';
import chromium from 'chromium';  // Usamos chromium para obtener el path

const waitForSelector = async (page, selector, timeout = 10000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    console.error(`Timeout waiting for selector: ${selector}`);
    return false;
  }
};
const retry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Intento ${i + 1} fallido:`, error.message);
      if (i === retries - 1) throw error; // Relanzar error después del último intento
    }
  }
};  

const scrapers = {
  tasaUsura: async (page) => {
    console.log('Iniciando scraping de Tasa Usura');
    await retry(() => page.goto('https://www.larepublica.co/indicadores-economicos/bancos/tasa-de-usura', { waitUntil: 'load', timeout: 60000 }));
    await retry(() => waitForSelector(page, '.price'));

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
    await retry(() => page.goto('https://www.larepublica.co/indicadores-economicos/bancos/dtf', { waitUntil: 'load', timeout: 60000 }));
    await retry(() => waitForSelector(page, '.price'));
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
    await retry(() =>page.goto('https://www.larepublica.co/indicadores-economicos/commodities/oro', { waitUntil: 'load',timeout: 60000 }));
    await retry(() =>waitForSelector(page, '.price'));
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
    await retry(() => page.goto('https://www.larepublica.co/indicadores-economicos/commodities/petroleo', { waitUntil: 'load' , timeout: 60000 }));
    await retry(() => waitForSelector(page, '.price'));
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
    await retry(() => page.goto('https://www.larepublica.co/indicadores-economicos/mercado-cambiario/dolar', { waitUntil: 'load',timeout: 60000 }));
    await retry(() => waitForSelector(page, '.price'));
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
    await retry(() => page.goto('https://www.larepublica.co/indicadores-economicos/macro/ipc', { waitUntil: 'load',timeout: 60000 }));
    await retry(() => waitForSelector(page, '.price'));
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
    console.log('Iniciando scraping de UVR');
    await retry(() => page.goto('https://www.larepublica.co/indicadores-economicos/bancos/uvr', { waitUntil: 'load', timeout: 60000 }));
    await retry(() => waitForSelector(page, '.price'));
    const data = await page.evaluate(() => {
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
    
    console.log('Datos obtenidos UVR:', data);
    return data;
  },
  
  euro: async (page) => {
    console.log('Iniciando scraping de Euro');
    await retry(() => page.goto('https://www.larepublica.co/indicadores-economicos/mercado-cambiario/euro', { waitUntil: 'load', timeout: 60000 }));
    await retry(() => waitForSelector(page, '.price'));
    const data = await page.evaluate(() => {
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
    
    console.log('Datos obtenidos Euro:', data);
    return data;
  }
};
const scrapeAllData = async () => {
  let browser;
  try {
    console.log('Iniciando proceso de scraping general');

    // Usamos el binario de Chromium proporcionado por 'chromium'
    browser = await puppeteer.launch({
      executablePath: chromium.path, // Usamos el path de Chromium
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      defaultViewport: { width: 1280, height: 720 }, // Tamaño ajustado
      timeout: 60000 // Tiempo de espera global de 60 segundos
    });

    const page = await browser.newPage(); // Mueve esta línea al inicio para evitar errores

    // Desactiva imágenes y otros recursos innecesarios
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const blockList = ['image', 'stylesheet', 'font'];
      if (blockList.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setViewport({ width: 1920, height: 1080 });

    const allResults = [];
    for (const [key, scraper] of Object.entries(scrapers)) {
      try {
        console.log(`Ejecutando scraper para ${key}...`);
        const dataArray = await scraper(page); // Asegúrate de que las funciones scraper acepten 'page' como argumento
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
    console.log('Iniciando scraping de datos...');
    const scrapedData = await scrapeAllData();

    if (!scrapedData || scrapedData.length === 0) {
      throw new Error('No se obtuvieron datos del scraping.');
    }

    // Procesar y actualizar datos
    const updatePromises = scrapedData
      .filter(item => item && item.price !== null) // Validar datos
      .map(async item => {
        const existing = existingDataMap.get(item.symbol);

        // Si no hay datos existentes, el precio actual será también el precio previo
        const previousPrice = existing ? existing.price : item.price;

        // Calcular cambios
        const priceChange = parseFloat((item.price - previousPrice).toFixed(2));
        const pricePercentChange = previousPrice 
          ? parseFloat(((item.price - previousPrice) / previousPrice * 100).toFixed(2)) 
          : 0;

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

    const results = await Promise.allSettled(updatePromises);
    const fulfilled = results.filter(result => result.status === 'fulfilled').map(r => r.value);
    const rejected = results.filter(result => result.status === 'rejected').map(r => r.reason);

    console.log(`${fulfilled.length} actualizaciones completadas exitosamente.`);
    if (rejected.length > 0) {
      console.error(`${rejected.length} actualizaciones fallaron. Razones:`, rejected);
    }

    await session.commitTransaction();

    res.json({ 
      message: 'Actualización completada',
      successCount: fulfilled.length,
      errorCount: rejected.length,
      data: fulfilled 
    });
  } catch (error) {
    console.error('Error en actualización:', error);
    await session.abortTransaction();
    res.status(500).json({ 
      error: 'Error al actualizar los datos',
      details: error.message 
    });
  } finally {
    session.endSession();
  }
};


export {
  scrapeAllData,
  getFinancialData,
  updateFinancialData
};
