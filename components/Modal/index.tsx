import { HTMLProps } from "react";
import { Heading } from "../Heading";
import cx from 'classnames';

interface ModalProps extends Omit<HTMLProps<HTMLDivElement>, 'className'> {
  isOpen: boolean;
}

function Modal({
  children,
  isOpen,
  ...rest
}: ModalProps) {
  return (
    <div
      id='defaultModal'
      tabIndex={-1}
      className={cx('overflow-y-auto overflow-x-hidden fixed z-50 w-full md:inset-0 bg-black/25', { hidden: !isOpen })}
    >
      <div
        className='relative mx-auto p-8 w-full max-w-2xl md:h-auto' {...rest}
      >
        <div className='relative rounded-lg shadow bg-gray-800'>
          {children}
        </div>
      </div>
    </div>
  );
}

interface ModalHeaderProps extends Omit<HTMLProps<HTMLDivElement>, 'className'> {
  children: string;
  onClose: () => void;
}

function ModalHeader({
  children,
  onClose,
  ...rest
}: ModalHeaderProps) {
  return (
    <div className='flex justify-between items-center px-6 py-4 rounded-t border-b border-gray-600' {...rest}>
      <Heading level={2}>
        {children}
      </Heading>
      <button
        type='button'
        className='text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white'
        onClick={onClose}
      >
        <svg aria-hidden='true' className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd'></path></svg>
        <span className='sr-only'>Fechar modal</span>
      </button>
    </div>
  );
}

interface ModalContentProps extends Omit<HTMLProps<HTMLDivElement>, 'className'> {}

function ModalContent({
  children,
  ...rest
}: ModalContentProps) {
  return (
    <div className='p-6 space-y-6' {...rest}>
      {children}
    </div>
  );
}

interface ModalButtonsProps extends Omit<HTMLProps<HTMLDivElement>, 'className'> {}

function ModalButtons({
  children,
  ...rest
}: ModalButtonsProps) {
  return (
    <div className='flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-600' {...rest}>
      {children}
    </div>
  );
}

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Buttons = ModalButtons;

export { Modal };