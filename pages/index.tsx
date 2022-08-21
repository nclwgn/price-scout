import type { NextPage } from 'next'
import { useState } from 'react';

const Home: NextPage = () => {
  const [searchUrl, setSearchUrl] = useState('');
  const [elementClassOrId, setElementClassOrId] = useState('');

  const [foundContentResponse, setFoundContentResponse] = useState<string>();

  async function onTestElementClick() {
    const response = await fetch('/api/test', {
      method: 'POST',
      body: JSON.stringify({
        url: searchUrl,
        element: elementClassOrId
      })
    });

    if (response.status === 200) {
      const body = JSON.parse(await response.json());

      console.log(body.foundContent);

      setFoundContentResponse(body.foundContent);
    }
  }

  return (
    <div className='container mx-auto mt-20 flex flex-col gap-y-5'>
      <h1 className='text-center'>
        Insira a URL da página que deseja rastrear
      </h1>

      <input 
        type='text'
        className='w-full text-xl px-3 py-1 text-center'
        value={searchUrl}
        onChange={(e) => setSearchUrl(e.target.value)}
        />

      <h2 className='text-center'>
        Class ou Id do elemento a ser analisado
      </h2>

      <input 
        type='text'
        className='w-full text-xl px-3 py-1 text-center'
        value={elementClassOrId}
        onChange={(e) => setElementClassOrId(e.target.value)}
      />

      <div className='flex justify-center gap-x-1'>
        <button className='text-lg primary' onClick={onTestElementClick}>
          { foundContentResponse ?
            `Resultado do teste: ${foundContentResponse.substring(0, 30)}${foundContentResponse.length > 30 ? '...' : ''}` :
            'Testar'
          }
        </button>
        <button className='text-lg success'>
          Adicionar rastreador
        </button>
      </div>
    </div>
  )
}

export default Home;
