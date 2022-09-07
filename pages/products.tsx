export default function Products() {
  return (
    <div className='container mx-auto'>
      <div className='flex justify-between'>
        <h1>Listagem de produtos</h1>
        <button className='success'>Adicionar</button>
      </div>

      <div className='rounded-lg'>
        <table className='table-auto border-2 border-collapse border-spacing-0 border-white/10 w-full bg-black/5 text-sm text-left my-5'>
          <thead className='border-b-2 border-white/10 bg-black/10 uppercase'>
            <th className='py-2 px-10'>Produto</th>
            <th className='py-2 px-10'>Nº rastreadores</th>
            <th className='py-2 px-10'></th>
          </thead>
          <tbody>
            <tr className='border-b-2 border-white/5'>
              <td className='py-2 px-10'>Headset Corsair Void Elite Gaming Wireless</td>
              <td className='py-2 px-10'>2</td>
              <td className='py-2 px-10 text-right'>
                <button className='danger sm'>X</button>
              </td>
            </tr>
            <tr className='border-b-2 border-white/5'>
              <td className='py-2 px-10'>Headset Corsair Void Elite Gaming Wireless</td>
              <td className='py-2 px-10'>2</td>
              <td className='py-2 px-10 text-right'>
                <button className='danger sm'>X</button>
              </td>
            </tr>
            <tr className='border-b-2 border-white/5'>
              <td className='py-2 px-10'>Headset Corsair Void Elite Gaming Wireless</td>
              <td className='py-2 px-10'>2</td>
              <td className='py-2 px-10 text-right'>
                <button className='danger sm'>X</button>
              </td>
            </tr>
            <tr className='border-b-2 border-white/5'>
              <td className='py-2 px-10'>Headset Corsair Void Elite Gaming Wireless</td>
              <td className='py-2 px-10'>2</td>
              <td className='py-2 px-10 text-right'>
                <button className='danger sm'>X</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='flex justify-end'>
        <button className='success'>Adicionar</button>
      </div>
    </div>
  );
}
