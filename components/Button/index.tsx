import { ButtonHTMLAttributes } from "react";
import cx from 'classnames';
import { LoadingPing } from "../LoadingPing";

type ButtonVariant = 'primary' | 'success' | 'danger' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'size'> {
  variant: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean
}

const variantUtility: Record<ButtonVariant, string> = {
  primary: 'bg-blue-900 border-blue-900 enabled:hover:border-blue-700',
  success: 'bg-green-900 border-green-900 enabled:hover:border-green-700',
  danger: 'bg-red-900 border-red-900 enabled:hover:border-red-700',
  secondary: 'bg-gray-600 border-gray-600 enabled:hover:border-gray-400'
}

const sizingUtility: Record<ButtonSize, string> = {
  sm: 'px-2 py-1',
  md: 'px-3 py-1',
  lg: 'text-lg px-4 py-1'
}

export function Button({
  variant,
  size = 'md',
  loading = false,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cx(
        'rounded-lg border-2 transition-all disabled:opacity-50',
        variantUtility[variant],
        sizingUtility[size]
      )}
      {...rest}
    >
      <div className='flex items-center gap-1'>
        {loading && <LoadingPing size={3} variant={variant} />}
        {children}
      </div>
    </button>
  )
}