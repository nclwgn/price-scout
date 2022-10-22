import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../services/prisma';
import { track } from '../../../../services/priceTracker';

interface TrackMultipleResponse {
  price: number;
}

interface TrackMultipleErrorResponse {
  errorCode: string;
  reason?: any;
}

export default async function TrackMultiple(
  req: NextApiRequest,
  res: NextApiResponse<TrackMultipleResponse | TrackMultipleErrorResponse>
) {

  // Request parsing and validation
  if (req.method !== 'POST')
    return res.status(400).send({ errorCode: 'method-not-allowed' });

  const { id } = req.query;

  const tracker = await prisma.tracker.findMany({
    where: {
      productId: Number(id)
    }
  });

  if (!tracker) {
    return res.status(400).json({ errorCode: 'tracker-not-found' });
  }

  let result = await track(tracker);

  if (result.errors.length > 0) {
    return res.status(400).json({
      errorCode: 'tracking-error',
      reason: result.errors
    });
  }

  res.status(200).end();
  
}
