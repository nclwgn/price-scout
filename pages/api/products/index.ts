import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../services/prisma';

interface CreateProductRequest {
  name: string;
}

interface Product {
  id: number;
  name: string;
}

export default async function CreateProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(400).send({ errorCode: 'method-not-allowed' });

  let content: CreateProductRequest;
  try {
    content = JSON.parse(req.body) as CreateProductRequest;
  }
  catch (error) {
    return res.status(400).send({ errorCode: 'invalid-json' });
  }

  // Checks required params
  if (!content.name)
    return res.status(400).send({ errorCode: 'name-required' });

  let product: Product;
  try {
    product = await prisma.product.create({
      data: {
        name: content.name
      }
    });
  }
  catch (error) {
    return res.status(400).send({ errorCode: 'product-creation-error', reason: error });
  }

  return res.status(200).json(product)
}