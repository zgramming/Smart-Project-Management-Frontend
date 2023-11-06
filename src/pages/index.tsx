import { Card, LoadingOverlay, Stack } from '@mantine/core';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import SubModulIcon from '@images/icon_sub_modul.png';
import ModulIcon from '@images/icon_modul.png';
import useBreakpoint from '@/hooks/useBreakpoint';
import HeaderLayoutIndex from '@/components/layout/HeaderLayoutIndex';
import { AccessCategoryModulRepository } from '@/features/setting/access-category-modul/access-category-modul.repository';

type ContentIndexItemProps = {
  index: number;
  name: string;
  path?: string;
};
const ContentIndexItem = ({ index, name, path }: ContentIndexItemProps) => {
  const { push } = useRouter();
  const { isMobile } = useBreakpoint();
  const onClick = () => {
    if (!path) return;

    push(path);
  };
  return (
    <div key={index} className="col-span-1">
      <Card h={150} shadow="xs" withBorder className="cursor-pointer hover:bg-green-100" onClick={onClick}>
        <Stack align="center" gap={'xs'} justify="center" className="h-full">
          <Image src={ModulIcon} alt="Divider Modul" width={isMobile ? 50 : 80} />
          <div className="font-bold text-sm text-center lg:text-base">{name}</div>
        </Stack>
      </Card>
    </div>
  );
};

const ContentIndex = () => {
  const { data: items } = AccessCategoryModulRepository.hooks.useListAccessByRole();
  return (
    <>
      {items.map((accessCategoryModul) => {
        const categoryModul = accessCategoryModul.CategoryModul;
        const moduls = categoryModul.AccessModul.map((accessModul) => accessModul.Modul);
        return (
          <div key={categoryModul.code} className={`px-5 lg:px-20`}>
            <Stack gap={'md'}>
              <div className="flex flex-row items-center justify-start gap-2">
                <div className="font-bold text-primary text-base lg:text-xl">{categoryModul.name}</div>
                <Image src={SubModulIcon} alt="Divider Modul" width={30} />
                <div className="grow h-[1px] bg-gray-300"></div>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 lg:gap-10">
                {moduls.map((modul, index) => {
                  const { name, AccessMenu } = modul;
                  const menus = AccessMenu.map((accessMenu) => accessMenu.Menu) || [];
                  const path = menus.length > 0 ? menus[0].prefix : '/';
                  return <ContentIndexItem key={index} index={index} name={name} path={path} />;
                })}
              </div>
            </Stack>
          </div>
        );
      })}
    </>
  );
};

export default function Home() {
  const { isLoading } = AccessCategoryModulRepository.hooks.useListAccessByRole();

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="min-h-screen">
        <LoadingOverlay visible={isLoading} />
        <Stack gap={'lg'}>
          <HeaderLayoutIndex useShadow />
          <ContentIndex />
          <div className="pb-32" />
        </Stack>
      </div>
    </>
  );
}
