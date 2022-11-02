import { HTMLProps } from 'react';
import cx from 'classnames';

interface TableProps extends Omit<HTMLProps<HTMLDivElement>, 'className'> {}

function Table({
  children,
  ...rest
}: TableProps) {
  return (
    <div
      className='table border-2 border-collapse border-spacing-0 border-white/10 w-full bg-black/5 text-sm text-left'
      {...rest}
    >
      {children}
    </div>
  );
}

interface TableHeadProps extends Omit<HTMLProps<HTMLDivElement>, 'className'> {}

function TableHead({
  children,
  ...rest
}: TableHeadProps) {
  return (
    <div
      className='table-header-group border-b-2 border-white/10 bg-black/10 uppercase font-bold'
      {...rest}
    >
      <TableRow>
        {children}
      </TableRow>
    </div>
  );
}

interface TableRowProps extends Omit<HTMLProps<HTMLDivElement>, 'className'> {}

function TableRow({
  children,
  ...rest
}: TableRowProps) {
  return (
    <div
      className='table-row border-b-2 border-white/5 hover:bg-black/20'
      {...rest}
    >
      {children}
    </div>
  );
}

interface TableCellProps extends Omit<HTMLProps<HTMLDivElement>, 'className'> {
  text?: 'left' | 'center' | 'right'
}

function TableCell({
  children,
  text = 'left',
  ...rest
}: TableCellProps) {
  return (
    <div
      className={cx('table-cell py-2 px-10', `text-${text}`)}
      {...rest}
    >
      {children}
    </div>
  );
}

Table.Head = TableHead;
Table.Row = TableRow;
Table.Cell = TableCell;

export { Table };
