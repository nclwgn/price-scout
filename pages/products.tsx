import { Table } from "../components/Table";

export default function Products() {
  return (
    <div className='container mx-auto'>
      <div className='flex justify-between'>
        <h1>Listagem de produtos</h1>
        <button className='success'>Adicionar</button>
      </div>

      <Table>
        <Table.Head>
          <Table.Cell>Produto</Table.Cell>
          <Table.Cell>Nº rastreadores</Table.Cell>
          <Table.Cell />
        </Table.Head>
        <Table.Row>
          <Table.Cell>Headset Corsair Void Elite Gaming Wireless</Table.Cell>
          <Table.Cell>2</Table.Cell>
          <Table.Cell text='right'>
            <button className='danger sm'>X</button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Headset Corsair Void Elite Gaming Wireless</Table.Cell>
          <Table.Cell>2</Table.Cell>
          <Table.Cell text='right'>
            <button className='danger sm'>X</button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Headset Corsair Void Elite Gaming Wireless</Table.Cell>
          <Table.Cell>2</Table.Cell>
          <Table.Cell text='right'>
            <button className='danger sm'>X</button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Headset Corsair Void Elite Gaming Wireless</Table.Cell>
          <Table.Cell>2</Table.Cell>
          <Table.Cell text='right'>
            <button className='danger sm'>X</button>
          </Table.Cell>
        </Table.Row>
      </Table>

      <div className='flex justify-end'>
        <button className='success'>Adicionar</button>
      </div>
    </div>
  );
}
