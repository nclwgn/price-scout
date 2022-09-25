import cx from "classnames";

type LoadingPingVariant = 'primary' | 'success' | 'danger' | 'secondary';

interface LoadingPingProps {
  size: 3;
  variant: LoadingPingVariant;
}

const variantUtility: Record<LoadingPingVariant, string> = {
  primary: 'blue',
  success: 'green',
  danger: 'red',
  secondary: 'gray'
}

export function LoadingPing({
  size,
  variant
}: LoadingPingProps) {
  return (
    <span className='flex'>
      <span className={cx('animate-ping absolute inline-flex rounded-full opacity-75', `bg-${variantUtility[variant]}-400`, `h-${size} w-${size}`)}></span>
      <span className={cx('relative inline-flex rounded-full', `bg-${variantUtility[variant]}-400`, `h-${size} w-${size}`)}></span>
    </span>
  );
}