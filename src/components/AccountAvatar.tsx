import { AuthenticationContext } from '@/context/AuthenticationContext';
import useBreakpoint from '@/hooks/useBreakpoint';
import { Menu, Avatar } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useContext } from 'react';

const AccountAvatar = () => {
  const { isMobile } = useBreakpoint();
  const { replace } = useRouter();
  const context = useContext(AuthenticationContext);
  const onLogout = () => {
    context.removeToken();
    replace('/login');
  };
  return (
    <div className="flex flex-row items-center justify-start gap-3">
      <div className="hidden lg:flex flex-col items-end">
        <div className="font-bold text-center">Zeffry Reynando</div>
        <div className="font-medium text-center">Superadmin</div>
      </div>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Avatar color="blue" radius="xl" size={isMobile ? 'md' : 'lg'} className="cursor-pointer">
            ZR
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
  );
};

export default AccountAvatar;
