import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { ParameterRepository } from '@/features/setting/parameter/parameter.repository';
import { getErrorMessageAxios, readableDate } from '@/utils/function';
import { Button, Card, Flex, Grid, Group, LoadingOverlay, Stack, Table, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Parameter">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const {
    data: parameterList,
    isLoading: isLoadingParameterList,
    mutate: reloadParameterList,
    total: totalParameterList,
  } = ParameterRepository.hooks.useList({
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
    push('parameter/form');
  };

  const onEditButton = (id: string) => {
    push({
      pathname: 'parameter/form',
      query: { id, action: 'edit' },
    });
  };

  const onDeleteHandler = async (id: string) => {
    try {
      const result = await ParameterRepository.api.delete(id);

      notifications.show({
        title: 'Success',
        color: 'green',
        message: result.message,
      });

      reloadParameterList();
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        message: message,
        color: 'red',
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
      onConfirm: () => onDeleteHandler(id),
      onCancel: () => {
        alert('Cancel');
      },
    });
  };

  return (
    <>
      <Card withBorder>
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
            <LoadingOverlay visible={isLoadingParameterList} />
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>NAME</Table.Th>
                    <Table.Th>CODE</Table.Th>
                    <Table.Th>VALUE</Table.Th>
                    <Table.Th>STATUS</Table.Th>
                    <Table.Th>CREATED AT</Table.Th>
                    <Table.Th>UPDATED AT</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {parameterList?.map((item, index) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>{item.code}</Table.Td>
                        <Table.Td>{item.value}</Table.Td>
                        <Table.Td>{item.status}</Table.Td>
                        <Table.Td>{readableDate(item.createdAt)}</Table.Td>
                        <Table.Td>{readableDate(item.updatedAt)}</Table.Td>
                        <Table.Td>
                          <Group>
                            <Button variant="outline" size="xs" color="blue" onClick={() => onEditButton(`${item.id}`)}>
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="xs"
                              color="red"
                              onClick={() => onDeleteButton(`${item.id}`)}
                            >
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
              total={totalParameterList}
              activePagination={activePagination}
              paginationSize={sizePagination}
              onChangePagination={setPagination}
              onChangePaginationSize={setSizePagination}
            />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
