import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { DeveloperTaskRepository } from '@/features/developer/task/developer-task.repository';
import { readableDate } from '@/utils/function';
import { Button, Card, Flex, Grid, Group, LoadingOverlay, Stack, Table, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Developer - Task">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const {
    data: tasks,
    isLoading: isLoadingTask,
    total: totalTask,
  } = DeveloperTaskRepository.hooks.useMe({
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

  const onEditButton = (id: string) => {
    push({
      pathname: 'task/form',
      query: { id, action: 'edit' },
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
              <Flex direction={'row'} justify={'end'} gap={'md'}></Flex>
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
                    <Table.Th>HISTORY</Table.Th>
                    <Table.Th>CREATE DATE</Table.Th>
                    <Table.Th>UPDATE DATE</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {tasks?.map((item, index) => {
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
                        <Table.Td>
                          <a
                            href="#"
                            className="text-blue-500 no-underline font-bold
                            hover:text-blue-600"
                          >
                            {item.ProjectTaskHistory.length}
                          </a>
                        </Table.Td>
                        <Table.Td>{readableDate(item.createdAt, 'YYYY-MM-DD HH:MM')}</Table.Td>
                        <Table.Td>{readableDate(item.updatedAt, 'YYYY-MM-DD HH:MM')}</Table.Td>
                        <Table.Td>
                          <Group>
                            <Button variant="outline" size="xs" color="blue" onClick={() => onEditButton(item.id)}>
                              Update
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
