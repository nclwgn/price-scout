import { useEffect, useState } from 'react';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Heading } from '../../../components/Heading';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps } from 'next';
import { prisma } from '../../../services/prisma';
import { useRouter } from 'next/router';

interface TrackersProps {
  product: {
    id: number;
    name: string;
  }
}

interface NewTrackerFormData {
  url: string;
  querySelector: string;
}

const schema = yup.object({
  url: yup.string()
    .required('A URL é obrigatória')
    .url('Insira uma URL válida'),
  querySelector: yup.string()
    .required('O seletor de query é obrigatório')
});

const Trackers = ({
  product
}: TrackersProps) => {
  const router = useRouter();

  const { handleSubmit, formState: { errors, isDirty }, register } = useForm<NewTrackerFormData>({
    resolver: yupResolver(schema)
  });

  const [foundContentResponse, setFoundContentResponse] = useState<string>();

  const [isTesting, setIsTesting] = useState(false);
  const [isValidTest, setIsValidTest] = useState(false);

  const [isCreating, setIsCreating] = useState(false);

  async function onTestElementClick(data: NewTrackerFormData) {
    setIsTesting(true);

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        body: JSON.stringify(data)
      });
  
      if (response.status === 200) {
        const body = await response.json();
  
        const returnContent = body.foundContent.toString().replace(/\s|(R\$)/g, '').replace(',', '.');
        setFoundContentResponse(returnContent);

        const foundNumber = Number(returnContent);
        if (foundNumber) {
          setIsValidTest(true);
        }
      }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setIsTesting(false);
    }
  }

  async function onCreateClick(data: NewTrackerFormData) {
    setIsCreating(true);

    try {
      const response = await fetch(`/api/products/${product.id}/trackers`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
  
      if (response.status === 200) {
        router.push(`/products/${product.id}`);
      }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setIsCreating(false);
    }
  }

  useEffect(() => {
    if (isDirty && isValidTest)
      setIsValidTest(false);
  }, [isDirty]);

  return (
    <div className='container mx-auto grid grid-cols-2 gap-5'>

      <section className='flex flex-col gap-5'>

        <div>
          <Heading level={1}>Adicionar um novo rastreamento</Heading>
          <p>em {product.name}</p>
        </div>

        <div className='flex flex-col gap-1'>
          <p>
            URL
          </p>
          <input 
            type='text'
            className='w-full text-xl text-center'
            disabled={isTesting || isCreating}
            {...register('url')}
          />
          {!!errors.url && <p className='text-sm text-red-500'>{errors.url.message}</p>}
        </div>

        <div className='flex flex-col gap-1'>
          <p>
            Seletor de query
          </p>
          <input 
            type='text'
            className='w-full text-xl text-center'
            disabled={isTesting || isCreating}
            {...register('querySelector')}
          />
          {!!errors.querySelector && <p className='text-sm text-red-500'>{errors.querySelector.message}</p>}
        </div>

      </section>

      <section>

        <div className='rounded-lg bg-gray-800 p-5 flex flex-col gap-y-5'>
          <Heading level={2}>
            Teste de rastreamento
          </Heading>

          <Button
            onClick={handleSubmit(onTestElementClick)}
            variant='primary'
            disabled={isTesting || isCreating}
          >
            {isTesting &&
              <span className='flex'>
                <span className='animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75'></span>
                <span className='relative inline-flex h-3 w-3 rounded-full bg-blue-400'></span>
              </span>
            }
            Iniciar
          </Button>

          <div className='flex gap-5'>
            <p>Resultados do teste </p>
            {isValidTest && <Badge type='success'>Teste válido</Badge>}
          </div>

          <p className='text-xs text-center'>
            {foundContentResponse}
          </p>
        </div>

        <div className='flex mt-5 justify-end'>

          <Button 
            variant='success'
            disabled={!isValidTest || isCreating}
            size='lg'
            onClick={handleSubmit(onCreateClick)}
          >
            {isCreating &&
              <span className='flex'>
                <span className='animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75'></span>
                <span className='relative inline-flex h-3 w-3 rounded-full bg-green-400'></span>
              </span>
            }
            Concluir cadastro
          </Button>

        </div>

      </section>
      
    </div>
  )
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


export default Trackers;
