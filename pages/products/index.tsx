import { GetServerSidePropsResult } from "next";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";
import { prisma } from "../../services/prisma";
import { BiPlus, BiRadar, BiScan, BiTrash } from "react-icons/bi";
import { useRouter } from "next/router";
import { NewProductModal } from "./components/NewProductModal";
import { useState } from "react";
import { PageHeading } from "../../components/PageHeading";
import { Prisma } from "@prisma/client";

interface Product {
  id: number;
  name: string;
  trackerCount: number;
  lastTracked: string | null;
  lowestPrice?: number | null;
}

interface ProductsProps {
  products: Product[];
}

interface RecordData {
  id: number;
  lastTracked: BigInt;
  lowestPrice: number;
}

export default function Products({
  products
}: ProductsProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function onModalClose(shouldRefresh: boolean) {
    if (shouldRefresh)
      router.replace(router.asPath);

    setIsModalOpen(false);
  }

  return (
    <>
      <div className='container mx-auto'>
        <PageHeading>
          <PageHeading.Title title='Listagem de produtos' />
          <PageHeading.Buttons>
            <Button variant='success' onClick={() => setIsModalOpen(true)}>
              <BiPlus /> Adicionar produto
            </Button>
          </PageHeading.Buttons>
        </PageHeading>

        <div className='my-5'>
          <Table>
            <Table.Head>
              <Table.Cell>Produto</Table.Cell>
              <Table.Cell>Nº rastreadores</Table.Cell>
              <Table.Cell>Último rastreio</Table.Cell>
              <Table.Cell>Melhor preço</Table.Cell>
              <Table.Cell />
            </Table.Head>

            {products.map(product => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.trackerCount}</Table.Cell>
                <Table.Cell>{product.lastTracked}</Table.Cell>
                <Table.Cell>{product.lowestPrice}</Table.Cell>
                <Table.Cell>
                  <div className='flex justify-end gap-1 items-center'>
                    <Button variant='success' size='sm'>
                      <BiScan size={16} />
                    </Button>
                    <Button variant='primary' size='sm' onClick={() => router.push(`/products/${product.id}`)}>
                      <BiRadar size={16} />
                    </Button>
                    <Button variant='danger' size='sm'>
                      <BiTrash size={16} />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </div>

        <div className='flex justify-end'>
          <Button variant='success' onClick={() => setIsModalOpen(true)}>
            <BiPlus /> Adicionar produto
          </Button>
        </div>
      </div>

      <NewProductModal
        isOpen={isModalOpen}
        onClose={(shouldRefresh) => onModalClose(shouldRefresh)}
      />
    </>
  );
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<ProductsProps>> {
  const products = await prisma.product.findMany({
    include: {
      trackers: {
        include: {
          records: {
            take: 1,
            orderBy: {
              date: 'desc'
            },
            select: {
              date: true
            }
          }
        }
      },
      _count: {
        select: {
          trackers: true
        },
      }
    }
  });

  const recordData = await prisma.$queryRaw<any[]>`
    SELECT
      t1.id,
      max(t3.date) AS lastTracked,
      min(t3.price) AS lowestPrice
    FROM Product t1
      JOIN Tracker t2 ON t2.productId = t1.id
      JOIN TrackRecord t3 ON t3.trackerId = t2.id
    WHERE t1.id IN (${Prisma.join(products.map(product => product.id))})
      AND t3.date >= (
        SELECT max(s0.date) FROM TrackRecord s0 JOIN Tracker s1 ON s1.id = s0.trackerId WHERE s1.productId = t1.id
      )
    GROUP BY t1.id
  `;

  return {
    props: {
      products: products.map(p => {
        const record = recordData.find(record => record.id === p.id);

        return {
          id: p.id,
          name: p.name,
          trackerCount: p._count.trackers,
          lastTracked: record !== undefined ? new Date(record.lastTracked).toISOString() : null,
          lowestPrice: record?.lowestPrice ?? null
        }
      })
    }
  };
}
