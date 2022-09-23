import { Browser } from "puppeteer";

interface ScrapeResult {
  url: string;
  content: string;
}

export const createBrowser = async (): Promise<Browser> => {
  const puppeteer = require('puppeteer');

  return await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });
}

export const scrapeSingle = async (browser: Browser, url: string): Promise<ScrapeResult> => {
  const page = await browser.newPage();

  await page.goto(url);
  const content = await page.content();

  return {
    url,
    content
  };
}

export const scrapeMultiple = async (browser: Browser, urls: string[]): Promise<ScrapeResult[]> => {
  return await Promise.all(urls.map(url => scrapeSingle(browser, url)));
}