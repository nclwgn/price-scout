import { JSDOM } from 'jsdom';

interface ParseResult {
  found: string;
}

export const parse = (querySelector: string, content: string): ParseResult => {
  const pageDom = new JSDOM(content);

  const foundDesiredElement = pageDom.window.document.querySelector(querySelector);

  if (!foundDesiredElement || !foundDesiredElement.textContent) {
    throw new Error('Content not found');
  }

  return {
    found: foundDesiredElement.textContent
  }
}