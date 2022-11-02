import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { BiRadar, BiScan } from "react-icons/bi";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "../../../components/Button";
import { PageHeading } from "../../../components/PageHeading";
import { Table } from "../../../components/Table";
import { prisma } from "../../../services/prisma";
import { TrackerRow } from "./components/TrackerRow";

interface TrackRecord {
  date: string;
  price: number;
}

interface Tracker {
  id: number;
  url: string;
  querySelector: string;
  lastPrice?: number;
  lastTracked?: string;
  priceIncrease?: number;
  records: TrackRecord[];
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
  const [invalidTrackers, setInvalidTrackers] = useState<number[]>([]);

  async function onTrackAll() {
    setIsTrackingAll(true);

    try {
      const response = await fetch(`/api/products/${product.id}/track`, {
        method: 'POST'
      });

      if (response.status !== 200) {
        const body = await response.json();
        if (body.reason) {
          setInvalidTrackers(body.reason.map((error: {id: number}) => error.id));
        }
      }
      else {
        setInvalidTrackers([]);
      }

      router.replace(router.asPath);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setIsTrackingAll(false);
    }
  }

  function onTrackSingle(id: number, result: boolean) {
    if (result) {
      setInvalidTrackers([...invalidTrackers.filter(invalidId => invalidId !== id)]);
    }
    else if (!invalidTrackers.some(invalidId => invalidId === id)) {
      setInvalidTrackers([...invalidTrackers, id]);
    }
    router.replace(router.asPath);
  }

  const mapDates = useCallback((product: Product) => {
    let output: any[] = [];

    for (const tracker of product.trackers) {
      for (const record of tracker.records) {
        let foundDate = output.find((chartDate: any) => chartDate.localeDate === new Date(record.date).toLocaleDateString());
        
        if (!foundDate) {
          output.push({
            localeDate: new Date(record.date).toLocaleDateString(),
            date: new Date(record.date),
            [tracker.id]: record.price
          });
        }
        else {
          foundDate[tracker.id] = record.price;
        }
      }
    }

      return output.sort((a, b) => a.date - b.date);
  }, [product]);
  
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
        Tendência
      </div>

      <div className='bg-gray-800 rounded-lg p-5 mt-5'>
        <ResponsiveContainer width='100%' aspect={5}>
          <LineChart data={mapDates(product)}>
            <XAxis dataKey='localeDate' stroke='lightGray'/>
            <YAxis stroke='lightGray' />
            <Tooltip />
            {product.trackers.map(tracker => (
              <Line type='monotone' dataKey={tracker.id} key={tracker.id} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-5 font-bold uppercase w-100'>
        Rastreadores
      </div>

      <div className='my-5'>
        <Table>
          <Table.Head>
            <Table.Cell>#</Table.Cell>
            <Table.Cell>URL</Table.Cell>
            <Table.Cell>Elemento</Table.Cell>
            <Table.Cell>Último preço</Table.Cell>
            <Table.Cell>Última verificação</Table.Cell>
            <Table.Cell />
          </Table.Head>

          {product.trackers.map(tracker => (
            <TrackerRow
              key={tracker.id}
              tracker={tracker}
              invalid={invalidTrackers.some(id => id === tracker.id)}
              onTrackSingleResult={result => onTrackSingle(tracker.id, result)}
            />
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

export async function getServerSideProps({ params }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<ProductDetailsProps>> {
  const id = parseInt(params?.id?.toString() ?? '');

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      trackers: {
        where: {
          active: true
        },
        select: {
          id: true,
          url: true,
          querySelector: true,
          records: {
            orderBy: {
              date: 'desc'
            },
            where: {
              date: {
                gte: new Date((new Date()).getDate() - 60)
              }
            }
          }
        }
      }
    }
  });

  if (!product) {
    return {
      redirect: {
        destination: '/products',
        permanent: false
      }
    }
  }

  let output: Product = {
    id: product.id,
    name: product.name,
    trackers: product.trackers.map(tracker => ({
      id: tracker.id,
      url: tracker.url,
      querySelector: tracker.querySelector,
      lastPrice: Number(tracker.records[0]?.price),
      lastTracked: tracker.records[0]?.date.toISOString() ?? null,
      records: tracker.records.map(record => ({
        date: record.date.toISOString(),
        price: Number(record.price)
      }))
    }))
  };

  for (const tracker of product.trackers) {
    if (tracker.records.length > 0) {
      // Gets all tracked dates in timestamp and selects the most recent one
      const recordsWithTimestamp = tracker.records.map(record => {
        const date = record.date;
        date.setHours(0, 0, 0, 0);
  
        return {
          ...record,
          timestamp: date.getTime()
        };
      });
      const lastTrackedTimestamp = recordsWithTimestamp[0].timestamp;
      const lastTrackedDate = new Date();
      lastTrackedDate.setTime(lastTrackedTimestamp);
  
      // Gets the last date before the most recent
      const nonLastTrackedRecords = recordsWithTimestamp.filter(record => record.timestamp !== lastTrackedTimestamp);
      
      if (nonLastTrackedRecords.length > 0) {
        const priceIncrease = (Number(recordsWithTimestamp[0].price) / Number(nonLastTrackedRecords[0].price)) - 1;
  
        const outputTracker = output.trackers.find(outputTracker => outputTracker.id === tracker.id)
        if (outputTracker)
          outputTracker.priceIncrease = priceIncrease;
      }
    }
  }


  return {
    props: {
      product: output
    }
  };
}
