import { AuthenticationContext } from '@/context/AuthenticationContext';
import { UserRepository } from '@/features/setting/user/user.repository';
import useBreakpoint from '@/hooks/useBreakpoint';
import { Menu, Avatar, LoadingOverlay } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useContext } from 'react';

const getEachCharacter = (name: string) => {
  const splitName = name.split(' ');
  const firstCharacter = splitName[0].charAt(0);
  const secondCharacter = splitName[1]?.charAt(0) || '';
  return `${firstCharacter}${secondCharacter}`;
};

const AccountAvatar = () => {
  const { isMobile } = useBreakpoint();
  const { replace } = useRouter();
  const context = useContext(AuthenticationContext);
  const { data, isLoading } = UserRepository.hooks.useMe();

  const onLogout = () => {
    context.removeToken();
    replace('/login');
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <div className="flex flex-row items-center justify-start gap-3">
        <div className="hidden lg:flex flex-col items-end">
          <div className="font-bold text-center">{data?.name}</div>
          <div className="font-medium text-center">{data?.role.name}</div>
        </div>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Avatar color="blue" radius="xl" size={isMobile ? 'md' : 'lg'} className="cursor-pointer">
              {getEachCharacter(data?.name || '')}
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Profile</Menu.Label>
            <Menu.Item leftSection={<IconLogout size={14} />} onClick={onLogout}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  );
};

export default AccountAvatar;
