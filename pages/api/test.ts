import type { NextApiRequest, NextApiResponse } from 'next'
import { scrape as chromiumScrape } from '../../services/chromiumScraping';
import { parse } from '../../utils/domParsing';

interface TestUrlAndElementRequest {
  url: string;
  querySelector: string;
}

interface TestUrlAndElementResponse {
  foundContent: string;
}

interface TestUrlAndElementErrorResponse {
  errorCode: string;
  reason?: string;
}

export default async function TestUrlAndElement(
  req: NextApiRequest,
  res: NextApiResponse<TestUrlAndElementResponse | TestUrlAndElementErrorResponse>
) {

  // Request parsing and validation
  if (req.method !== 'POST')
    return res.status(400).send({ errorCode: 'method-not-allowed' });
    
  let content: TestUrlAndElementRequest;
  try {
    content = JSON.parse(req.body) as TestUrlAndElementRequest;
  }
  catch (error) {
    return res.status(400).send({ errorCode: 'invalid-json' });
  }

  // Checks required params
  if (!content.querySelector)
    return res.status(400).send({ errorCode: 'query-selector-required' });

  if (!content.url)
    return res.status(400).send({ errorCode: 'url-required' });

  // Tries to get the content via Chromium
  const chromium = await chromiumScrape(content.url);

  if (chromium.error || !chromium.content) {
    res.status(400).json({
      errorCode: chromium.error?.code ?? '',
      reason: chromium.error?.reason
    });
    return;
  }

  const domParsing = parse(content.querySelector, chromium.content);

  if (domParsing.error || !domParsing.found) {
    res.status(400).json({
      errorCode: domParsing.error?.code ?? '',
      reason: domParsing.error?.reason
    });
    return;
  }

  res.status(200).json({
    foundContent: domParsing.found
  });
  
}
