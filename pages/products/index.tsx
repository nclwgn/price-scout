import { GetServerSidePropsResult } from "next";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";
import { prisma } from "../../services/prisma";
import { BiPlus, BiRadar, BiScan, BiTrash } from "react-icons/bi";
import { useRouter } from "next/router";
import { NewProductModal } from "./components/NewProductModal";
import { useState } from "react";
import { PageHeading } from "../../components/PageHeading";
import { IncreaseBadge } from "../../components/IncreaseBadge";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";

interface Product {
  id: number;
  name: string;
  trackerCount: number;
  lastTracked: string | null;
  lowestPrice: number | null;
  priceIncrease: number | null;
}

interface ProductsProps {
  products: Product[];
}

interface StateMachineContext {
  id?: number;
}

type StateMachineEvent = { type: 'TRACK' | 'DELETE', id: number | undefined } | { type: 'TRACKED' | 'DELETED', id?: number };

const setStateIdAction = assign<StateMachineContext, StateMachineEvent>((_, event) => ({ id: event.id }));

export default function Products({
  products
}: ProductsProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, send] = useMachine(createMachine({
    id: 'home',
    initial: 'idle',
    schema: {
      context: {} as StateMachineContext,
      events: {} as StateMachineEvent
    },
    states: {
      idle: {
        on: {
          TRACK: {
            target: 'tracking',
            actions: setStateIdAction
          },
          DELETE: {
            target: 'deleting',
            actions: setStateIdAction
          }
        }
      },
      tracking: {
        on: {
          TRACKED: {
            target: 'idle',
            actions: ['resetOperationId']
          }
        }
      },
      deleting: {
        on: {
          DELETED: {
            target: 'idle',
            actions: ['resetOperationId']
          }
        }
      }
    }
  }, {
    actions: {
      resetOperationId: () => ({})
    }
  }));

  function onModalClose(shouldRefresh: boolean) {
    if (shouldRefresh)
      router.replace(router.asPath);

    setIsModalOpen(false);
  }

  async function onTrack(id?: number) {
    send({ type: 'TRACK', id });

    if (id) {
      try {
        await fetch(`/api/products/${id}/track`, {
          method: 'POST'
        });
  
        router.replace(router.asPath);
      }
      catch (error) {
        console.log(error);
      }
      finally {
        send('TRACKED');
      }
    }
  }

  function onDelete(id?: number) {
    send({ type: 'DELETE', id });

    setTimeout(() => {
      send('DELETED')
    }, 3000);
  }

  return (
    <>
      <div className='container mx-auto'>
        <PageHeading>
          <PageHeading.Title title='Listagem de produtos' />
          <PageHeading.Buttons>
            <Button
              variant='success'
              onClick={() => setIsModalOpen(true)}
            >
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
                <Table.Cell>{!!product.lastTracked ? new Date(product.lastTracked).toLocaleDateString() : ''}</Table.Cell>
                <Table.Cell>
                  <span className='inline-flex gap-1 items-center'>
                    {!!product.lowestPrice && `R$ ${product.lowestPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
                    {(!!product.priceIncrease || product.priceIncrease === 0) &&
                      <IncreaseBadge percentage={product.priceIncrease} />
                    }
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className='flex justify-end gap-1 items-center'>
                    <Button
                      variant='success'
                      size='sm'
                      disabled={!state.can({ type: 'TRACK', id: product.id })}
                      loading={state.matches('tracking') && state.context.id === product.id}
                      onClick={() => onTrack(product.id)}
                    >
                      <BiScan size={16} />
                    </Button>
                    <Button variant='primary' size='sm' onClick={() => router.push(`/products/${product.id}`)}>
                      <BiRadar size={16} />
                    </Button>
                    <Button
                      variant='danger'
                      size='sm'
                      disabled={!state.can({ type: 'DELETE', id: product.id })}
                      loading={state.matches('deleting') && state.context.id === product.id}
                      onClick={() => onDelete(product.id)}
                    >
                      <BiTrash size={16} />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </div>

        <div className='flex justify-end gap-3'>
          <Button
            variant='success'
            onClick={() => setIsModalOpen(true)}
          >
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
    where: {
      active: true
    },
    include: {
      trackers: {
        include: {
          records: {
            where: {
              date: {
                gte: new Date((new Date()).getDate() - 5)
              }
            },
            orderBy: {
              date: 'desc'
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

  return {
    props: {
      products: products.map(product => {
        let output: Product = {
          id: product.id,
          name: product.name,
          trackerCount: product._count.trackers,
          lastTracked: null,
          lowestPrice: null,
          priceIncrease: null
        };

        const records = product.trackers
          .map(tracker => tracker.records)
          .reduce((a, b) => a.concat(b), []);

        if (records.length > 0) {
          // Gets all tracked dates in timestamp and selects the most recent one
          const recordsWithTimestamp = records.map(record => {
            const date = record.date;
            date.setHours(0, 0, 0, 0);

            return {
              ...record,
              timestamp: date.getTime()
            };
          });
          const lastTrackedTimestamp = Math.max(...recordsWithTimestamp.map(record => record.timestamp));
          const lastTrackedDate = new Date();
          lastTrackedDate.setTime(lastTrackedTimestamp);

          output.lastTracked = lastTrackedDate.toISOString();
  
          // Between the most recent, gets the lowest price
          const lastTrackedDateRecords = recordsWithTimestamp.filter(record => record.timestamp === lastTrackedTimestamp);
          const lowestPrice = Math.min(...lastTrackedDateRecords.map(record => Number(record.price)));

          output.lowestPrice = lowestPrice;
  
          // Gets the last date before the most recent
          const nonLastTrackedRecords = recordsWithTimestamp.filter(record => record.timestamp !== lastTrackedTimestamp);
          
          if (nonLastTrackedRecords.length > 0) {
            const increaseComparisonTimestamp = Math.max(...nonLastTrackedRecords.map(record => record.timestamp));
            const increaseComparisonLowestPrice = Math.min(...records.filter(record => record.date.getTime() === increaseComparisonTimestamp).map(record => Number(record.price)));
            const priceIncrease = (lowestPrice / increaseComparisonLowestPrice) - 1;

            if (product.id === 21) console.log(lowestPrice, '/', increaseComparisonLowestPrice, '=', priceIncrease)

            output.priceIncrease = priceIncrease;
          }
        }

        return output;
      })
    }
  };
}
