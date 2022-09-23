import { GetServerSidePropsResult } from "next";
import { Button } from "../../components/Button";
import { Heading } from "../../components/Heading";
import { Table } from "../../components/Table";
import { prisma } from "../../services/prisma";
import { BiPlus, BiRadar, BiScan, BiTrash } from "react-icons/bi";
import { useRouter } from "next/router";
import { NewProductModal } from "./components/NewProductModal";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  trackerCount: number;
}

interface ProductsProps {
  products: Product[];
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
        <div className='flex justify-between'>
          <Heading level={1}>Listagem de produtos</Heading>
          <Button variant='success'>
            <div className='flex items-center gap-1' onClick={() => setIsModalOpen(true)}>
              <BiPlus /> Adicionar produto
            </div>
          </Button>
        </div>

        <div className='my-5'>
          <Table>
            <Table.Head>
              <Table.Cell>Produto</Table.Cell>
              <Table.Cell>Nº rastreadores</Table.Cell>
              <Table.Cell />
            </Table.Head>

            {products.map(product => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.trackerCount}</Table.Cell>
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
            <div className='flex items-center gap-1'>
              <BiPlus /> Adicionar produto
            </div>
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
      _count: {
        select: { trackers: true },
      }
    }
  });

  return {
    props: {
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        trackerCount: p._count.trackers
      }))
    }
  };
}
