import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../services/prisma';
import { track } from '../../../../services/priceTracker';

interface TrackSingleResponse {
  price: number;
}

interface TrackSingleErrorResponse {
  errorCode: string;
  reason?: string;
}

export default async function TrackSingle(
  req: NextApiRequest,
  res: NextApiResponse<TrackSingleResponse | TrackSingleErrorResponse>
) {

  // Request parsing and validation
  if (req.method !== 'POST')
    return res.status(400).send({ errorCode: 'method-not-allowed' });

  const { id } = req.query;

  const tracker = await prisma.tracker.findUnique({
    where: {
      id: Number(id)
    }
  });

  if (!tracker) {
    return res.status(400).json({ errorCode: 'tracker-not-found' });
  }

  const trackRecords = await track([tracker]);

  res.status(200).json({
    price: Number(trackRecords[0]?.price)
  });
  
}