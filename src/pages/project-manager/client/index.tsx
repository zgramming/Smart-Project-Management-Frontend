import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProjectClientRepository } from '@/features/common/project-client/project-client.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Button, Card, Flex, Grid, Group, LoadingOverlay, Stack, Table, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title={'Manage Client'}>{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);

  const {
    data: clients,
    total: totalClients,
    isLoading: isLoadingClients,
    mutate: reloadClients,
  } = ProjectClientRepository.hooks.useListClient({
    page: activePagination,
    pageSize: parseInt(sizePagination),
    name: searchQuery,
  });

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value.length === 0 || value === '') {
      setSearchQuery(undefined);
    } else {
      setSearchQuery(value);
    }
  };

  const onAddButton = () => {
    push('client/form');
  };

  const onEditButton = (id: string) => {
    push({
      pathname: 'client/form',
      query: { id: id, action: 'edit' },
    });
  };

  const onDeleteHandler = async (id: string) => {
    try {
      const result = await ProjectClientRepository.api.delete(id);
      notifications.show({
        title: 'Success',
        color: 'green',
        message: result.message,
      });
      reloadClients();
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        color: 'red',
        message: message,
      });
    }
  };

  const onDeleteButton = (id: string) => {
    modals.openConfirmModal({
      title: 'Konfirmasi',
      children: 'Apakah anda yakin ingin menghapus data ini?',
      labels: {
        cancel: 'Batal',
        confirm: 'Hapus',
      },
      confirmProps: {
        color: 'red',
      },
      onConfirm: () => {
        onDeleteHandler(id);
      },
      onCancel: () => {},
    });
  };

  return (
    <>
      <Card withBorder>
        <LoadingOverlay visible={isLoadingClients} />
        <Stack gap={'md'}>
          <Grid gutter={'lg'}>
            <Grid.Col
              span={{
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
                xl: 6,
              }}
            >
              <Group justify="left">
                <TextInput
                  placeholder="Cari sesuatu..."
                  rightSection={<IconSearch />}
                  defaultValue={searchQuery}
                  onChange={onChangeSearch}
                />
              </Group>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
                xl: 6,
              }}
            >
              <Flex direction={'row'} justify={'end'} gap={'md'}>
                <Button leftSection={<IconPlus />} variant="filled" onClick={onAddButton}>
                  Tambah
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
          <Stack gap={'md'} id="table">
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>NAME</Table.Th>
                    <Table.Th>CODE</Table.Th>
                    <Table.Th>PROJECTS</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {clients?.map((item, index) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{`${index + 1}`}</Table.Td>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>{item.code}</Table.Td>
                        <Table.Td>{item._count.Project}</Table.Td>
                        <Table.Td>
                          <Group>
                            <Button variant="outline" size="xs" color="blue" onClick={() => onEditButton(item.id)}>
                              Edit
                            </Button>
                            <Button variant="outline" size="xs" color="red" onClick={() => onDeleteButton(item.id)}>
                              Hapus
                            </Button>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
            <PaginationComponent
              activePagination={activePagination}
              paginationSize={sizePagination}
              total={totalClients || 0}
              onChangePagination={setPagination}
              onChangePaginationSize={setSizePagination}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
