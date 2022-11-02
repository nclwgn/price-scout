import cx from 'classnames';
import { BiDownArrowAlt, BiMinus, BiUpArrowAlt } from 'react-icons/bi';

interface IncreaseBadgeProps {
  percentage: number;
}

export function IncreaseBadge({
  percentage
}: IncreaseBadgeProps) {
  return (
    <div
      className={cx(
        'text-sm font-semibold rounded bg-green-700 px-1 inline-flex items-center', { 
          'bg-green-700': percentage < 0,
          'bg-red-700': percentage > 0,
          'bg-gray-500': percentage === 0
        })}
    >
      {percentage > 0 ?
        <BiUpArrowAlt /> :
        percentage < 0 ?
        <BiDownArrowAlt /> :
        <BiMinus />
      }

      {(percentage * 100).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
      &nbsp;%
    </div>
  )
}