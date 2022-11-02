import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../services/prisma';

export default async function SingleProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'DELETE')
    return res.status(400).send({ errorCode: 'method-not-allowed' });

  const { id } = req.query;

  const product = await prisma.product.update({
    where: {
      id: Number(id)
    },
    data: {
      active: false
    }
  })

  if (!product) {
    return res.status(400).json({ errorCode: 'product-not-found' });
  }

  res.status(200).end();
  
}
