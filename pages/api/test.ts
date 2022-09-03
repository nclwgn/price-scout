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

export default async function TestUrlAndElement(
  req: NextApiRequest,
  res: NextApiResponse<TestUrlAndElementResponse>
) {
  if (req.method !== 'POST')
    res.status(400).end();
    
  const content = JSON.parse(req.body) as TestUrlAndElementRequest;

  const result = await fetch(content.url);

  const text = await result.text();

  const dom = new JSDOM(text);

  const foundDesiredElement = dom.window.document.querySelector(`#${content.element}, .${content.element}`);

  if (foundDesiredElement) {
    res.status(200).json({ foundContent: foundDesiredElement.textContent ?? '' });
  }

  res.status(400).end();
}
