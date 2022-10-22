import type { NextApiRequest, NextApiResponse } from 'next'
import { testTrack } from '../../services/priceTracker';

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

  const scrapeResult = await testTrack(content.url, content.querySelector);

  res.status(200).json({
    foundContent: scrapeResult.found
  });
  
}
