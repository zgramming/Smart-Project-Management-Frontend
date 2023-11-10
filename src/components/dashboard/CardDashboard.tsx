import { Card, Stack, ActionIcon } from '@mantine/core';
import { IconUserSquareRounded, IconDotsVertical } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface CardDashboardProps {
  icon: ReactNode;
  title: string;
  total: number;
  onClickDetail?: () => void;
}

const CardDashboard = ({ icon, title, total, onClickDetail }: CardDashboardProps) => {
  return (
    <Card shadow="sm" padding="lg" radius={'lg'}>
      <Stack gap={'md'}>
        <div className="flex flex-row items-center justify-between">
          {icon ? icon : <IconUserSquareRounded size={32} />}
          <ActionIcon variant="subtle" color="black" radius="xl" onClick={onClickDetail}>
            <IconDotsVertical size={20} />
          </ActionIcon>
        </div>
        <Stack gap={'md'}>
          <div className=" text-center font-bold text-4xl">{total}</div>
          <div className="text-sm font-semibold">{title}</div>
        </Stack>
      </Stack>
    </Card>
  );
};

export default CardDashboard;
