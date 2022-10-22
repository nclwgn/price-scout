import { TrackRecord } from "@prisma/client";
import { Browser } from "puppeteer";
import { parse } from "../utils/domParsing";
import { createBrowser, scrapeSingle } from "./chromiumScraping"
import { prisma } from './prisma';

interface Tracker {
  id: number;
  url: string;
  querySelector: string;
}

interface TrackMultipleResult {
  trackRecords: TrackRecord[];
  errors: Error[];
}

const isFulfilled = (promise: PromiseSettledResult<TrackRecord>): promise is PromiseFulfilledResult<TrackRecord> =>
  promise.status === 'fulfilled';

const isRejected = (promise: PromiseSettledResult<unknown>): promise is PromiseRejectedResult =>
  promise.status === 'rejected';

export const track = async (trackers: Tracker[]): Promise<TrackMultipleResult> => {
  const browser = await createBrowser();

  const trackRecords = await Promise.allSettled(trackers.map(tracker => trackSingle(browser, tracker)));

  await browser.close();

  return {
    trackRecords: trackRecords.filter(isFulfilled).map(fulfilled => fulfilled.value),
    errors: trackRecords.filter(isRejected).map(rejected => rejected.reason)
  };
}

const trackSingle = async (browser: Browser, tracker: Tracker) => {
  try {
    const scrapeResult = await scrapeSingle(browser, tracker.url);
    
    const parsedContent = parse(tracker.querySelector, scrapeResult.content);
    
    const price = Number(parsedContent.found.toString().replace(/\s|(R\$)|\./g, '').replace(',', '.'));

    if (!price || isNaN(price))
      throw new Error('Price content not found');

    return await prisma.trackRecord.create({
      data: {
        date: new Date(),
        price,
        trackerId: tracker.id
      }
    });
  }
  catch (err) {
    throw {
      id: tracker.id,
      error: err
    };
  }
}

export const testTrack = async (url: string, querySelector: string) => {
  const browser = await createBrowser();

  const scrapeResult = await scrapeSingle(browser, url);

  await browser.close();

  return parse(querySelector, scrapeResult.content);
}
