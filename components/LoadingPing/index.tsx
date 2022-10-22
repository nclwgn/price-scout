import cx from "classnames";

interface LoadingPingProps {
  size: 3;
}

export function LoadingPing({
  size
}: LoadingPingProps) {
  return (
    <>
      <div className={cx('animate-ping absolute rounded-full opacity-75 bg-white/25', `h-${size} w-${size}`)}></div>
      <div className={cx('relative rounded-full bg-white/25', `h-${size} w-${size}`)}></div>
    </>
  );
}