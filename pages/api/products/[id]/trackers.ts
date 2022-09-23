import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../../services/prisma';

interface CreateTrackerRequest {
  url: string;
  querySelector: string;
}

interface Tracker {
  id: number;
  url: string;
  querySelector: string;
}

export default async function CreateTracker(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: productId } = req.query;

  if (req.method !== 'POST')
    return res.status(400).send({ errorCode: 'method-not-allowed' });

  let content: CreateTrackerRequest;
  try {
    content = JSON.parse(req.body) as CreateTrackerRequest;
  }
  catch (error) {
    return res.status(400).send({ errorCode: 'invalid-json' });
  }

  // Checks required params
  if (!content.url)
    return res.status(400).send({ errorCode: 'url-required' });

  if (!content.querySelector)
    return res.status(400).send({ errorCode: 'query-selector-required' });

  let tracker: Tracker;
  try {
    tracker = await prisma.tracker.create({
      data: {
        productId: Number(productId),
        url: content.url,
        querySelector: content.querySelector
      }
    });
  }
  catch (error) {
    return res.status(400).send({ errorCode: 'tracker-creation-error', reason: error });
  }

  return res.status(200).json(tracker)
}