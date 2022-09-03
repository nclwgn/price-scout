import HikerIcon from '../../assets/hiker.svg';

export function Header() {
  return (
    <header className='container mx-auto my-5 font-head text-5xl flex flex-row items-center justify-center'>
      <HikerIcon className='fill-blue-500 h-12' />
      <p>
        <span className='text-blue-500'>
          price
        </span>
        scout
      </p>
    </header>
  );
}