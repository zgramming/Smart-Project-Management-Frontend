import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProjectTaskRepository } from '@/features/common/project-task/project-task.repository';
import { getErrorMessageAxios, readableDate } from '@/utils/function';
import { Button, Card, Flex, Grid, Group, LoadingOverlay, Stack, Table, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Project Manager - Assign Task">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const {
    data: dataTask,
    isLoading: isLoadingTask,
    total: totalTask,
    mutate: reloadTask,
  } = ProjectTaskRepository.hooks.useListTask({
    page: activePagination,
    pageSize: Number(sizePagination),
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
    push('assign-task/form');
  };

  const onEditButton = (id: string) => {
    push({
      pathname: 'assign-task/form',
      query: { id: id, action: 'edit' },
    });
  };

  const onDeleteHandler = async (id: string) => {
    try {
      const response = await ProjectTaskRepository.api.delete(id);
      notifications.show({
        title: 'Success',
        message: response.message,
        color: 'green',
      });

      reloadTask();
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
            <LoadingOverlay visible={isLoadingTask} />
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>CLIENT</Table.Th>
                    <Table.Th>PROJECT</Table.Th>
                    <Table.Th>USER</Table.Th>
                    <Table.Th>NAME</Table.Th>
                    <Table.Th>START DATE</Table.Th>
                    <Table.Th>END DATE</Table.Th>
                    <Table.Th>DIFFICULTY</Table.Th>
                    <Table.Th>STATUS</Table.Th>
                    <Table.Th>APPROVE</Table.Th>
                    <Table.Th>CREATE DATE</Table.Th>
                    <Table.Th>UPDATE DATE</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {dataTask?.map(function (item, index) {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.Project.ProjectClient.name}</Table.Td>
                        <Table.Td>{item.Project.name}</Table.Td>
                        <Table.Td>{item.User.name}</Table.Td>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>{readableDate(item.startDate, 'DD MMMM YYYY HH:MM')}</Table.Td>
                        <Table.Td>{readableDate(item.endDate, 'DD MMMM YYYY HH:MM')}</Table.Td>
                        <Table.Td>{item.degreeOfDifficulty}</Table.Td>
                        <Table.Td>{item.status}</Table.Td>
                        <Table.Td>{item.approveStatus}</Table.Td>
                        <Table.Td>{readableDate(item.createdAt, 'YYYY-MM-DD HH:MM')}</Table.Td>
                        <Table.Td>{readableDate(item.updatedAt, 'YYYY-MM-DD HH:MM')}</Table.Td>
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
              total={totalTask}
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
