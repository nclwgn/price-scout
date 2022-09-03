// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { JSDOM } from 'jsdom';

interface TestUrlAndElementRequest {
  url: string;
  element: string;
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
  if (!content.element)
    return res.status(400).send({ errorCode: 'element-required' });

  if (!content.url)
    return res.status(400).send({ errorCode: 'url-required' });

  let pageCrawl: Response;
  try {
    pageCrawl = await fetch(content.url);
  }
  catch (error: any) {
    return res.status(400).send({
      errorCode: 'unable-fetch-url',
      reason: error
    });
  }

  let pageDom: JSDOM;
  try {
    const pageText = await pageCrawl.text();
    pageDom = new JSDOM(pageText);
  }
  catch (error: any) {
    return res.status(400).send({
      errorCode: 'dom-parsing-error',
      reason: error
    })
  }

  const foundDesiredElement = pageDom.window.document.querySelector(`#${content.element}, .${content.element}`);

  if (!foundDesiredElement) {
    return res.status(400).send({ errorCode: 'element-not-found' });
  }
  
  res.status(200).json({ foundContent: foundDesiredElement.textContent ?? '' });
}
