import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../services/prisma';

export default async function SingleTracker(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'DELETE')
    return res.status(400).send({ errorCode: 'method-not-allowed' });

  const { id } = req.query;

  const tracker = await prisma.tracker.update({
    where: {
      id: Number(id)
    },
    data: {
      active: false
    }
  })

  if (!tracker) {
    return res.status(400).json({ errorCode: 'tracker-not-found' });
  }

  res.status(200).end();
  
}
