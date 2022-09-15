import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { Button } from "../../components/Button";
import { Heading } from "../../components/Heading";
import { Table } from "../../components/Table";
import { prisma } from "../../services/prisma";

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
  return (
    <div className='container mx-auto'>
      <div className='flex justify-between'>
        <Heading level={1}>Listagem de produtos</Heading>
        <Button variant='success'>Adicionar</Button>
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
              <Table.Cell text='right'>
                <Button variant='primary' size='sm'>T</Button>
                <Button variant='danger' size='sm'>X</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </div>

      <div className='flex justify-end'>
        <Button variant='success'>Adicionar</Button>
      </div>
    </div>
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
