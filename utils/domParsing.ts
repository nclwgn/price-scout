import { JSDOM } from 'jsdom';

interface ParseResult {
  found?: string;
  error?: {
    code: string;
    reason?: any;
  }
}

export const parse = (querySelector: string, content: string): ParseResult => {
  let pageDom: JSDOM;

  try {
    pageDom = new JSDOM(content);
  }
  catch (error: any) {
    return {
      error: {
        code: 'dom-parsing-error',
        reason: error
      }
    }
  }

  const foundDesiredElement = pageDom.window.document.querySelector(querySelector);

  if (!foundDesiredElement || !foundDesiredElement.textContent) {
    return {
      error: {
        code: 'content-not-found'
      }
    }
  }

  return {
    found: foundDesiredElement.textContent
  }
}