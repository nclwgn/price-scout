import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiRadar, BiScan } from "react-icons/bi";
import { Button } from "../../../components/Button";
import { PageHeading } from "../../../components/PageHeading";
import { Table } from "../../../components/Table";
import { prisma } from "../../../services/prisma";
import { TrackerRow } from "./components/TrackerRow";

interface Tracker {
  id: number;
  url: string;
  querySelector: string;
  lastPrice?: number;
  lastTracked?: string;
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
  const [isTrackingAll, setIsTrackingAll] = useState(false);

  async function onTrackAll() {
    setIsTrackingAll(true);

    try {
      await fetch(`/api/products/${product.id}/track`, {
        method: 'POST'
      });

      router.replace(router.asPath);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setIsTrackingAll(false);
    }
  }
  
  return (
    <div className='container mx-auto'>
      <PageHeading>
        <PageHeading.Title
          title='Produto'
          subTitle={product.name}
          goBackTo='/products'
        />
        <PageHeading.Buttons>
          <Button
            variant='success'
            onClick={onTrackAll}
            disabled={isTrackingAll}
            loading={isTrackingAll}
          >
            <BiScan /> Rastrear todos agora
          </Button>
          <Button
            variant='success'
            onClick={() => router.push(`/products/${product.id}/trackers`)}
          >
            <BiRadar /> Adicionar rastreador
          </Button>
        </PageHeading.Buttons>
      </PageHeading>

      <div className='mt-5 font-bold uppercase w-100'>
        Rastreadores
      </div>

      <div className='my-5'>
        <Table>
          <Table.Head>
            <Table.Cell>URL</Table.Cell>
            <Table.Cell>Elemento</Table.Cell>
            <Table.Cell>Último preço</Table.Cell>
            <Table.Cell>Última verificação</Table.Cell>
            <Table.Cell />
          </Table.Head>

          {product.trackers.map(tracker => (
            <TrackerRow key={tracker.id} tracker={tracker} />
          ))}
        </Table>
      </div>

      <div className='flex justify-end gap-3'>
        <Button
          variant='success'
          onClick={onTrackAll}
          disabled={isTrackingAll}
          loading={isTrackingAll}
        >
          <BiScan /> Rastrear todos agora
        </Button>
        <Button
          variant='success'
          onClick={() => router.push(`/products/${product.id}/trackers`)}
        >
          <BiRadar /> Adicionar rastreador
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
      trackers: {
        select: {
          id: true,
          url: true,
          querySelector: true,
          records: {
            orderBy: {
              date: 'desc'
            },
            take: 1
          }
        }
      }
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
        trackers: product.trackers.map(tracker => ({
          id: tracker.id,
          url: tracker.url,
          querySelector: tracker.querySelector,
          lastPrice: Number(tracker.records[0]?.price),
          lastTracked: tracker.records[0]?.date.toISOString() ?? null
        }))
      }
    }
  };
}
