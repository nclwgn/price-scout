import { Browser } from "puppeteer";
import { parse } from "../utils/domParsing";
import { createBrowser, scrapeSingle } from "./chromiumScraping"
import { prisma } from './prisma';

interface Tracker {
  id: number;
  url: string;
  querySelector: string;
}

export const track = async (trackers: Tracker[]) => {
  const browser = await createBrowser();

  const trackRecords = await Promise.all(trackers.map(tracker => trackSingle(browser, tracker)));

  await browser.close();

  return trackRecords;
}

const trackSingle = async (browser: Browser, tracker: Tracker) => {
  const scrapeResult = await scrapeSingle(browser, tracker.url);

  const parsedContent = parse(tracker.querySelector, scrapeResult.content);

  const price = Number(parsedContent.found.toString().replace(/\s|(R\$)|\./g, '').replace(',', '.'));

  return prisma.trackRecord.create({
    data: {
      date: new Date(),
      price,
      trackerId: tracker.id
    }
  })
}

export const testTrack = async (url: string, querySelector: string) => {
  const browser = await createBrowser();

  const scrapeResult = await scrapeSingle(browser, url);

  await browser.close();

  return parse(querySelector, scrapeResult.content);
}
