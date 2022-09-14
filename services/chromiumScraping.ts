interface ScrapeResult {
  content?: string;
  error?: {
    code: 'browser-launch' | 'browser-navigation-error' | 'browser-closing-error';
    reason?: any;
  }
}

export const scrape = async (url: string): Promise<ScrapeResult> => {

  const puppeteer = require('puppeteer');

  let browser: any;
  let page: any;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox']
    });
    page = await browser.newPage();
  }
  catch (error: any) {
    return {
      error: {
        code: 'browser-launch',
        reason: error
      }
    };
  }

  try {
    await page.goto(url);
  }
  catch (error: any) {
    return {
      error: {
        code: 'browser-navigation-error',
        reason: error
      }
    };
  }

  const content = await page.content();

  try {
    await browser.close();
  }
  catch (error: any) {
    console.log(error);
    return {
      error: {
        code: 'browser-closing-error',
        reason: error
      }
    };
  }

  return {
    content
  };
}