import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { BiRadar, BiScan, BiTrash } from "react-icons/bi";
import { Button } from "../../../components/Button";
import { Heading } from "../../../components/Heading";
import { Table } from "../../../components/Table";
import { prisma } from "../../../services/prisma";

interface Tracker {
  id: number;
  url: string;
  element: string;
}

interface Product {
  id: number;
  name: string;
  trackers: Tracker[];
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({
  product
}: ProductDetailsProps) {
  const router = useRouter();
  
  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-end'>
        <div>
          <Heading level={1}>Produto</Heading>
          <Heading level={2}>
            {product.name}
          </Heading>
        </div>
        <div className='flex gap-1'>
          <Button variant='success'>
            <div className='flex items-center gap-1'>
              <BiScan /> Rastrear todos agora
            </div>
          </Button>
          <Button
            variant='success'
            onClick={() => router.push(`/products/${product.id}/trackers`)}
          >
            <div className='flex items-center gap-1'>
              <BiRadar /> Adicionar rastreador
            </div>
          </Button>
        </div>
      </div>

      <div className='mt-5 font-bold uppercase w-100'>
        Rastreadores
      </div>

      <div className='my-5'>
        <Table>
          <Table.Head>
            <Table.Cell>URL</Table.Cell>
            <Table.Cell>Elemento</Table.Cell>
            <Table.Cell>Melhor preço</Table.Cell>
            <Table.Cell>Última verificação</Table.Cell>
            <Table.Cell />
          </Table.Head>

          {product.trackers.map(tracker => (
            <Table.Row key={tracker.id}>
              <Table.Cell>{tracker.url}</Table.Cell>
              <Table.Cell>{tracker.element}</Table.Cell>
              <Table.Cell>R$ 165,90</Table.Cell>
              <Table.Cell>25/09/2022</Table.Cell>
              <Table.Cell>
                <div className='flex justify-end gap-1 items-center'>
                  <Button variant='success' size='sm'>
                    <BiScan size={16} />
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

      <div className='flex justify-end gap-1'>
        <Button variant='success'>
          <div className='flex items-center gap-1'>
            <BiScan /> Rastrear todos agora
          </div>
        </Button>
        <Button
          variant='success'
          onClick={() => router.push(`/products/${product.id}/trackers`)}
        >
          <div className='flex items-center gap-1'>
            <BiRadar /> Adicionar rastreador
          </div>
        </Button>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = parseInt(params?.id?.toString() ?? '');

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      trackers: true
    }
  });

  if (!product) {
    return {
      redirect: {
        destination: '/products'
      },
      props: {}
    }
  }

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        trackers: product.trackers
      }
    }
  };
}
