import useBreakpoint from '@/hooks/useBreakpoint';
import Logo from '@images/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import AccountAvatar from '../AccountAvatar';

type HeaderLayoutIndexProps = {
  useShadow?: boolean;
  currentModule?: string;
};
const HeaderLayoutIndex = ({ useShadow = false, currentModule }: HeaderLayoutIndexProps) => {
  const now = 'Selasa, 12 Oktober 2021 10:00:00';
  const { isMobile, isDesktop } = useBreakpoint();

  return (
    <div
      id="header-index"
      className={`
      h-full relative flex flex-row justify-between ${useShadow && 'shadow'}
      lg:px-20 
      `}
    >
      <div className="basis-0 grow flex flex-col justify-center">
        <Link href="/" className="w-min">
          <Image src={Logo} alt="Logo" width={isMobile ? 150 : isDesktop ? 200 : 250} />
        </Link>
      </div>
      <div
        className={`basis-0 grow flex flex-col items-center ${currentModule ? 'justify-end' : 'justify-center'} gap-3`}
      >
        <div className="text-base font-medium">{now}</div>
        {currentModule && (
          <div className="bg-current-module-secondary text-current-module font-bold py-1 px-5">{currentModule}</div>
        )}
      </div>
      <div className="basis-0 grow flex flex-col justify-center items-end">
        <AccountAvatar />
      </div>
    </div>
  );
};

export default HeaderLayoutIndex;
