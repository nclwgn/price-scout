import { HTMLAttributes } from "react";

type HeadingLevels = 1 | 2;

interface HeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'className'> {
  level: HeadingLevels;
}

const levelsUtility: Record<HeadingLevels, string> = {
  1: 'text-2xl',
  2: 'text-xl'
};

export function Heading({
  level,
  children,
  ...rest
}: HeadingProps) {
  const HeadingTag: keyof JSX.IntrinsicElements = `h${level}`;

  return (
    <HeadingTag
      className={levelsUtility[level]}
      {...rest}
    >
      {children}
    </HeadingTag>
  )
}