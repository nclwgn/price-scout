import { ReactNode } from "react";

interface BadgeProps {
  type: 'success'
  children: ReactNode;
}

const tailwindColor = {
  'success': 'green'
}

export function Badge({
  type,
  children
}: BadgeProps) {
  return (
    <div className={`flex gap-1 items-center uppercase text-xs rounded-md bg-${tailwindColor[type]}-900 px-3 p-1`}>
      <span className={`relative inline-flex h-3 w-3 rounded-full bg-${tailwindColor[type]}-400`}></span>
      {children}
    </div>
  );
}