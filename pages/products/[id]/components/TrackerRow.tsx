import { useState } from "react";
import { BiErrorCircle, BiScan, BiTrash } from "react-icons/bi";
import { Button } from "../../../../components/Button";
import { IncreaseBadge } from "../../../../components/IncreaseBadge";
import { Table } from "../../../../components/Table";

interface Tracker {
  id: number;
  url: string;
  querySelector: string;
  lastPrice?: number;
  lastTracked?: string;
  priceIncrease?: number;
}

interface TrackerRowProps {
  tracker: Tracker;
  invalid?: boolean;
  onTrackSingleResult: (result: boolean) => void;
}

export function TrackerRow({
  tracker,
  invalid = false,
  onTrackSingleResult
}: TrackerRowProps) {
  const [inOperation, setInOperation] = useState(false);

  async function onTrack() {
    setInOperation(true);

    try {
      const response = await fetch(`/api/trackers/${tracker.id}/track`, {
        method: 'POST'
      });

      onTrackSingleResult(response.status === 200);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setInOperation(false);
    }
  }

  async function onDelete() {
    setInOperation(true);

    try {
      const response = await fetch(`/api/trackers/${tracker.id}`, {
        method: 'DELETE'
      });

      onTrackSingleResult(response.status === 200);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setInOperation(false);
    }
  }

  return (
    <Table.Row>
      <Table.Cell>{tracker.id}</Table.Cell>
      <Table.Cell>{tracker.url}</Table.Cell>
      <Table.Cell>{tracker.querySelector}</Table.Cell>
      <Table.Cell>
        {!!tracker.lastPrice &&
          'R$ ' + tracker.lastPrice?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
        {!!tracker.priceIncrease &&
          <IncreaseBadge percentage={tracker.priceIncrease} />}
      </Table.Cell>
      <Table.Cell>
        {tracker.lastTracked ?
        new Date(tracker.lastTracked).toLocaleDateString() :
        '--'}
      </Table.Cell>
      <Table.Cell>
        <div className='flex justify-end gap-1 items-center'>
          {invalid && <BiErrorCircle size={20} className='fill-red-600' />}
          <Button variant='success' size='sm' onClick={() => onTrack()} loading={inOperation} disabled={inOperation}>
            <BiScan size={16} />
          </Button>
          <Button variant='danger' size='sm' onClick={() => onDelete()} disabled={inOperation}>
            <BiTrash size={16} />
          </Button>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}