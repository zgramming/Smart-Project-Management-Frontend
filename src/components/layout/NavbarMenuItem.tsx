import { SidebarLayoutContext } from '@/context/SidebarLayoutContext';
import { isSideMenuActive } from '@/utils/function';
import { Stack, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronUp, IconChevronDown, IconCategory2 } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useContext } from 'react';

type NavbarMenuItemProps = {
  id: number;
  path?: string;
  name: string;

  childrenMenu: {
    id: number;
    name: string;
    path?: string;
  }[];
};

const NavbarMenuItem = ({ id, path, name, childrenMenu }: NavbarMenuItemProps) => {
  const { toggleSidebar } = useContext(SidebarLayoutContext);
  const { push, pathname } = useRouter();
  const [opened, { toggle }] = useDisclosure(true);
  const subMenus = childrenMenu ?? [];
  const isHaveChild = subMenus.length > 0;

  const isActive = isSideMenuActive({
    currentPath: pathname,
    link: path ?? '',
  });

  const onClickMenu = () => {
    if (isHaveChild) {
      toggle();
    } else {
      if (path) {
        toggleSidebar();
        push(`/${path}`);
      }
    }
  };

  return (
    <Stack gap={0}>
      <div
        key={id}
        className={`
          flex flex-row items-start gap-3 w-full cursor-pointer font-medium py-3 px-5 border-solid border-0
          ${isActive && !isHaveChild && 'text-primary bg-primary/20 border-r-4'}
          hover:bg-primary/20 hover:text-primary
          `}
        onClick={onClickMenu}
      >
        <div className="grow basis-1/12 self-center">
          <IconCategory2 size={20} className="text-primary" />
        </div>
        {!isHaveChild && (
          <>
            <div className="grow basis-11/12 text-sm">{name}</div>
          </>
        )}
        {isHaveChild && (
          <>
            <div className="grow basis-10/12 text-sm">{name}</div>
            <div className="grow basis-1/12">
              {opened ? <IconChevronUp size={20} color="gray" /> : <IconChevronDown size={20} color="gray" />}
            </div>
          </>
        )}
      </div>
      <Collapse in={opened} transitionDuration={200} transitionTimingFunction="linear">
        <Stack gap={0}>
          {subMenus.map((subItem) => {
            return <NavbarSubMenuItem id={`${subItem.id}`} name={subItem.name} key={subItem.id} path={subItem.path} />;
          })}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NavbarSubMenuItem = ({ id, name, path }: { id: string; name: string; path?: string }) => {
  const { toggleSidebar } = useContext(SidebarLayoutContext);
  const { push, pathname } = useRouter();
  const isActive = isSideMenuActive({
    currentPath: pathname,
    link: path ?? '',
  });

  const onClickMenu = () => {
    if (path) {
      toggleSidebar();
      push(`/${path}`);
    }
  };
  return (
    <div
      key={id}
      className={`
        flex flex-row items-start gap-3 w-full cursor-pointer font-medium py-3 pl-14 border-solid border-0
        ${isActive && 'text-primary bg-primary/20 border-r-4'}
        lg:pl-12 lg:py-3 
        hover:bg-primary/20 hover:text-primary
        `}
      onClick={onClickMenu}
    >
      <div className="grow basis-1/12">
        <IconCategory2 size={20} className="text-primary" />
      </div>
      <div className="grow basis-10/12 text-sm">{name}</div>
    </div>
  );
};

export default NavbarMenuItem;
