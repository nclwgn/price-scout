import { NextApiRequest, NextApiResponse } from "next";
const puppeteer = require('puppeteer');

interface TestChromiumFetchRequest {
  url: string;
  element: string;
}

export default async function TestChromiumFetch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(400).send({ errorCode: 'method-not-allowed' });

  let content: TestChromiumFetchRequest;
  try {
    content = JSON.parse(req.body) as TestChromiumFetchRequest;
  }
  catch (error) {
    return res.status(400).send({ errorCode: 'invalid-json' });
  }

  // Checks required params
  if (!content.element)
    return res.status(400).send({ errorCode: 'element-required' });

  if (!content.url)
    return res.status(400).send({ errorCode: 'url-required' });

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(content.url);

  console.log(await page.content());

  await browser.close();

  res.status(200).json({
    myResponse: 'my-response'
  });
}