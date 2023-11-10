import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProjectDocumentRepository } from '@/features/common/project-document/project-document.repository';
import { baseFileDocumentURL } from '@/utils/constant';
import { getErrorMessageAxios } from '@/utils/function';
import { ActionIcon, Button, Card, Flex, Grid, Group, LoadingOverlay, Stack, Table, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconFile3d, IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Project Manager - Document">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);

  const {
    data: dataDocument,
    isLoading: isLoadingDocument,
    mutate: reloadDocument,
    total: totalDocument,
  } = ProjectDocumentRepository.hooks.useListDocument({
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
    push('document/form');
  };

  const onEditButton = (id: string) => {
    push({
      pathname: 'document/form',
      query: { id, action: 'edit' },
    });
  };

  const onDeleteHandler = async (id: string) => {
    try {
      const result = await ProjectDocumentRepository.api.delete(id);
      notifications.show({
        message: result.message,
        color: 'green',
        title: 'Success',
      });

      reloadDocument();
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        message: message,
        color: 'red',
        title: 'Error',
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
            <LoadingOverlay visible={isLoadingDocument} />
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>CLIENT</Table.Th>
                    <Table.Th>PROJECT</Table.Th>
                    <Table.Th>NAME</Table.Th>
                    <Table.Th>FILE</Table.Th>
                    <Table.Th>STATUS</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {dataDocument?.map((item, index) => {
                    const isHaveFile = item.file.length > 0 && item.file !== '';
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.Project.ProjectClient.name}</Table.Td>
                        <Table.Td>{item.Project.name}</Table.Td>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>{item.status}</Table.Td>
                        <Table.Td>
                          {!isHaveFile && ''}
                          {isHaveFile && (
                            <ActionIcon
                              variant="outline"
                              color="blue"
                              onClick={() => window.open(`${baseFileDocumentURL}/${item.file}`)}
                            >
                              <IconFile3d stroke={1.5} />
                            </ActionIcon>
                          )}
                        </Table.Td>
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
                </tbody>
              </Table>
            </Table.ScrollContainer>
            <PaginationComponent
              total={totalDocument || 0}
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
