interface ScrapeResult {
  content?: string;
  error?: {
    code: 'unable-to-fetch-url';
    reason?: any;
  }
}

export const scrape = async (url: string): Promise<ScrapeResult> => {

  let pageCrawl: Response;
  try {
    pageCrawl = await fetch(url);
  }
  catch (error: any) {
    return {
      error: {
        code: 'unable-to-fetch-url',
        reason: error
      }
    };
  }

  const pageText = await pageCrawl.text();

  return {
    content: pageText
  }
  
}