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
import { PageHeading } from '../../../components/PageHeading';
import { BiRadar } from 'react-icons/bi';

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
  
        setFoundContentResponse(body.foundContent);
        const foundNumber = Number(body.foundContent.toString().replace(/\s|(R\$)|\./g, '').replace(',', '.'));

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
    <div className='container mx-auto'>
      <PageHeading>
        <PageHeading.Title
          title='Adicionar um novo rastreamento'
          subTitle={product.id.toString()}
          goBackTo={`/products/${product.id}`}
        />
      </PageHeading>

      <div className='flex flex-col gap-5 mt-5'>
        
        <section className='flex flex-col gap-5'>

          <Heading level={2}>
            1. Insira os dados do produto a ser rastreado
          </Heading>

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

          <div className='flex justify-end'>
            <Button
              onClick={handleSubmit(onTestElementClick)}
              variant='primary'
              disabled={isTesting || isCreating}
              loading={isTesting}
            >
              <BiRadar />
              Iniciar teste de rastreamento
            </Button>
          </div>

        </section>

        <section className='flex flex-col gap-5'>

          <Heading level={2}>
            2. Verifique os dados obtidos do rastreamento
          </Heading>

          <div className='rounded-lg p-5 flex justify-between border-dotted border-gray-500 border-2'>

            <p>
              <span className='font-bold'>Resultados do teste: </span>
              {foundContentResponse}
            </p>
            {isValidTest && <Badge type='success'>Teste válido</Badge>}

          </div>

        </section>

        <section className='flex justify-between'>

          <Heading level={2}>
            3. Conclua o cadastro
          </Heading>

          <Button 
            variant='success'
            disabled={!isValidTest || isCreating}
            size='lg'
            onClick={handleSubmit(onCreateClick)}
            loading={isCreating}
          >
            Concluir cadastro
          </Button>

        </section>

      </div>
        
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
