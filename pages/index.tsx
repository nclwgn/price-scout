import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { Badge } from '../components/Badge';

const Home: NextPage = () => {
  const [searchUrl, setSearchUrl] = useState('');
  const [elementClassOrId, setElementClassOrId] = useState('');
  const [trackingName, setTrackingName] = useState('');

  const [foundContentResponse, setFoundContentResponse] = useState<string>();

  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isValidTest, setIsValidTest] = useState<boolean>(false);

  async function onTestElementClick() {
    setIsTesting(true);

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        body: JSON.stringify({
          url: searchUrl,
          element: elementClassOrId
        })
      });
  
      if (response.status === 200) {
        const body = await response.json();
  
        setFoundContentResponse(body.foundContent);

        const foundNumber = Number(body.foundContent);
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

  useEffect(() => {
    if (isValidTest)
      setIsValidTest(false);
  }, [searchUrl, elementClassOrId]);

  return (
    <div className='container mx-auto grid grid-cols-2 gap-5'>

      <section className='flex flex-col gap-y-5'>
        <h1>Crie um novo rastreamento</h1>

        <div>
          <p>
            URL do produto
          </p>
          <input 
            type='text'
            className='w-full text-xl text-center'
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
            disabled={isTesting}
          />
        </div>

        <div>
          <p>
            Seletor de query
          </p>
          <input 
            type='text'
            className='w-full text-xl text-center'
            value={elementClassOrId}
            onChange={(e) => setElementClassOrId(e.target.value)}
            disabled={isTesting}
          />
        </div>
        
      </section>

      <section>

        <div className='rounded-lg bg-gray-800 p-5 flex flex-col gap-y-5'>
          <h2>
            Teste de rastreamento
          </h2>

          <button
            className='text-lg primary flex gap-3 justify-center items-center'
            onClick={onTestElementClick}
            disabled={isTesting || searchUrl.length <= 0 || elementClassOrId.length <= 0}
          >
            {isTesting &&
              <span className='flex'>
                <span className='animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75'></span>
                <span className='relative inline-flex h-3 w-3 rounded-full bg-blue-400'></span>
              </span>
            }
            Iniciar
          </button>

          <div className='flex gap-5'>
            <p>Resultados do teste </p>
            {isValidTest && <Badge type='success'>Teste válido</Badge>}
          </div>

          <p className='text-xs text-center'>
            {foundContentResponse}
          </p>
        </div>

        <div className='flex mt-5 gap-2 items-end'>
          
          <div className='grow'>
            <p className={!isValidTest ? 'opacity-50' : ''}>Nome do rastreador</p>
            <input
              type='text'
              className='w-full text-xl text-center'
              value={trackingName}
              onChange={(e) => setTrackingName(e.target.value)}
              disabled={!isValidTest}
            />
          </div>

          <button className='text-lg success' disabled={!isValidTest}>
            Adicionar
          </button>

        </div>

      </section>
      
    </div>
  )
}

export default Home;
