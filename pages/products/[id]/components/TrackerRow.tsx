import { useState } from "react";
import { BiScan, BiTrash } from "react-icons/bi";
import { Button } from "../../../../components/Button";
import { Table } from "../../../../components/Table";

interface Tracker {
  id: number;
  url: string;
  querySelector: string;
  lastPrice?: number;
  lastTracked?: string;
}

interface TrackerRowProps {
  tracker: Tracker;
}

export function TrackerRow({
  tracker
}: TrackerRowProps) {
  const [isTracking, setIsTracking] = useState(false);

  async function onTrackSingle(trackerId: number) {
    setIsTracking(true);

    try {
      const response = await fetch(`/api/trackers/${trackerId}/track`, {
        method: 'POST'
      });

      if (response.status === 200) {
        console.log(await response.json());
      }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setIsTracking(false);
    }
  }

  return (
    <Table.Row>
      <Table.Cell>{tracker.url}</Table.Cell>
      <Table.Cell>{tracker.querySelector}</Table.Cell>
      <Table.Cell>
        {tracker.lastPrice ?
        'R$ ' + tracker.lastPrice?.toLocaleString('pt-BR', {minimumFractionDigits: 2}) :
        '--'}
      </Table.Cell>
      <Table.Cell>
        {tracker.lastTracked ?
        new Date(tracker.lastTracked).toLocaleDateString() :
        '--'}
      </Table.Cell>
      <Table.Cell>
        <div className='flex justify-end gap-1 items-center'>
          <Button variant='success' size='sm' onClick={() => onTrackSingle(tracker.id)} loading={isTracking}>
            <BiScan size={16} />
          </Button>
          <Button variant='danger' size='sm'>
            <BiTrash size={16} />
          </Button>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}