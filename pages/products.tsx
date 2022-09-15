import { Button } from "../components/Button";
import { Table } from "../components/Table";

export default function Products() {
  return (
    <div className='container mx-auto'>
      <div className='flex justify-between'>
        <h1>Listagem de produtos</h1>
        <Button variant='success'>Adicionar</Button>
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
            <Button variant='danger' size='sm'>X</Button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Headset Corsair Void Elite Gaming Wireless</Table.Cell>
          <Table.Cell>2</Table.Cell>
          <Table.Cell text='right'>
            <Button variant='danger' size='sm'>X</Button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Headset Corsair Void Elite Gaming Wireless</Table.Cell>
          <Table.Cell>2</Table.Cell>
          <Table.Cell text='right'>
            <Button variant='danger' size='sm'>X</Button>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Headset Corsair Void Elite Gaming Wireless</Table.Cell>
          <Table.Cell>2</Table.Cell>
          <Table.Cell text='right'>
            <Button variant='danger' size='sm'>X</Button>
          </Table.Cell>
        </Table.Row>
      </Table>

      <div className='flex justify-end'>
        <Button variant='success'>Adicionar</Button>
      </div>
    </div>
  );
}
