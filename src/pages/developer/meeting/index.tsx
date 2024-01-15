import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { DeveloperMeetingRepository } from '@/features/developer/meeting/developer-meeting.repository';
import { readableDate } from '@/utils/function';
import { Card, Flex, Grid, Group, LoadingOverlay, Stack, Table, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Developer - Meeting">{page}</AdminLayout>;
};

export default function Page() {
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const {
    data: meetings,
    isLoading: isLoadingMeetings,
    total: totalMeetings,
  } = DeveloperMeetingRepository.hooks.useMe({
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
            <LoadingOverlay visible={isLoadingMeetings} />
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>CLIENT</Table.Th>
                    <Table.Th>PROJECT</Table.Th>
                    <Table.Th>NAME</Table.Th>
                    <Table.Th>START DATE</Table.Th>
                    <Table.Th>END DATE</Table.Th>
                    <Table.Th>METHOD</Table.Th>
                    <Table.Th>LINK</Table.Th>
                    <Table.Th>STATUS</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {meetings?.map((item, index) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{`${index + 1}`}</Table.Td>
                        <Table.Td>{item.Project.ProjectClient.name}</Table.Td>
                        <Table.Td>{item.Project.name}</Table.Td>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>{readableDate(item.startDate)}</Table.Td>
                        <Table.Td>{readableDate(item.endDate)}</Table.Td>
                        <Table.Td>{item.method}</Table.Td>
                        <Table.Td>
                          <Link href={item.link} target="_blank">
                            {item.link}
                          </Link>
                        </Table.Td>
                        <Table.Td>{item.status}</Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
            <PaginationComponent
              total={totalMeetings || 0}
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
