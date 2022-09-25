import { useRouter } from "next/router";
import { HTMLProps, ReactNode } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Heading } from "../Heading";

interface PageHeadingProps extends Omit<HTMLProps<HTMLDivElement>, 'className'> {}

function PageHeading({
  children
}: PageHeadingProps) {
  return (
    <div className='flex justify-between items-end'>
      {children}
    </div>
  );
}

interface PageHeadingTitleProps {
  goBackTo?: string;
  title: string;
  subTitle?: string;
}

function PageHeadingTitle({
  goBackTo,
  title,
  subTitle
}: PageHeadingTitleProps) {
  const router = useRouter();

  return (
    <div className='flex gap-3 items-center'>
      {!!goBackTo && <BiArrowBack className='cursor-pointer' size={24} onClick={() => router.push(goBackTo)} />}
      <div>
        <Heading level={1}>
          {title}
        </Heading>
        <Heading level={2}>
          {subTitle}
        </Heading>
      </div>
    </div>
  )
}

interface PageHeadingButtons {
  children: ReactNode | ReactNode[]
}

function PageHeadingButtons({
  children
}: PageHeadingButtons) {
  return (
    <div className='flex gap-3'>
      {children}
    </div>
  )
}

PageHeading.Title = PageHeadingTitle;
PageHeading.Buttons = PageHeadingButtons;

export { PageHeading };