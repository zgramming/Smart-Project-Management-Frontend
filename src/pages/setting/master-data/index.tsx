import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { MasterCategoryRepository } from '@/features/setting/master-category/master-category.repository';
import { MasterDataRepository } from '@/features/setting/master-data/master-data.repository';
import { getErrorMessageAxios, readableDate } from '@/utils/function';
import { Button, Card, Flex, Grid, Group, LoadingOverlay, Select, Stack, Table, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Master Data">{page}</AdminLayout>;
};

export default function Page() {
  const { push, query } = useRouter();
  const { masterCategoryCode } = query;
  const [selectedMasterCategory, setSelectedMasterCategory] = useState<string | undefined>();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const {
    data: dataMasterDataList = [],
    isLoading: isLoadingMasterDataList,
    total: totalMasterDataList,
    mutate: reloadMasterDataList,
  } = MasterDataRepository.hooks.useByMasterCategoryCode(selectedMasterCategory);
  const { data: dataMasterCategoryList = [] } = MasterCategoryRepository.hooks.useList({
    page: 1,
    pageSize: 100,
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
    if (!masterCategoryCode) {
      notifications.show({
        title: 'Error',
        message: 'Master Category Code is required',
        color: 'red',
      });
      return;
    }

    push({
      pathname: 'master-data/form',
      query: { action: 'add', masterCategoryCode },
    });
  };

  const onEditButton = (id: string) => {
    if (!masterCategoryCode) {
      notifications.show({
        title: 'Error',
        message: 'Master Category Code is required',
        color: 'red',
      });
      return;
    }

    push({
      pathname: 'master-data/form',
      query: { id, action: 'edit', masterCategoryCode },
    });
  };

  const onDeleteHandler = async (id: string) => {
    try {
      const result = await MasterDataRepository.api.delete(id);
      notifications.show({
        title: 'Success',
        color: 'green',
        message: result.message,
      });

      reloadMasterDataList();
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
              <Group justify="left" gap={'md'}>
                <TextInput
                  placeholder="Cari sesuatu..."
                  rightSection={<IconSearch />}
                  defaultValue={searchQuery}
                  onChange={onChangeSearch}
                />
                <Select
                  defaultValue={selectedMasterCategory}
                  placeholder="Pick Master Category"
                  data={dataMasterCategoryList.map((item) => ({ value: `${item.code}`, label: item.name }))}
                  nothingFoundMessage="No options"
                  searchable
                  clearable
                  onChange={(value) => {
                    setSelectedMasterCategory(value ? `${value}` : undefined);
                    push({
                      pathname: 'master-data',
                      ...(value ? { query: { masterCategoryCode: `${value}` } } : {}),
                    });
                  }}
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
            <LoadingOverlay visible={isLoadingMasterDataList} />
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>PARENT MASTER</Table.Th>
                    <Table.Th>MASTER CATEGORY CODE</Table.Th>
                    <Table.Th>NAME</Table.Th>
                    <Table.Th>CODE</Table.Th>
                    <Table.Th>STATUS</Table.Th>
                    <Table.Th>CREATED AT</Table.Th>
                    <Table.Th>UPDATED AT</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {dataMasterDataList.map((item, index) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.parentMasterDataId}</Table.Td>
                        <Table.Td>{item.masterCategoryCode}</Table.Td>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>{item.code}</Table.Td>
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
              total={totalMasterDataList}
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
