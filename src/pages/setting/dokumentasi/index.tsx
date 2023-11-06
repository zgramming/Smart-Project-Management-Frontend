import ButtonDelete from '@/components/ButtonDelete';
import ButtonEdit from '@/components/ButtonEdit';
import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { DokumentasiRepository } from '@/features/setting/dokumentasi/dokumentasi.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Button, Card, Flex, Grid, Group, Input, LoadingOverlay, Modal, ScrollArea, Stack, Table } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCalendar, IconFilter, IconPlus, IconSearch } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Data Dokumentasi">{page}</AdminLayout>;
};

export default function Page() {
  const { push } = useRouter();
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const [isModalFilterOpen, { open: openModalFilter, close: closeModalFilter }] = useDisclosure(false);

  const skip = (activePagination - 1) * Number(sizePagination);
  const limit = Number(sizePagination);
  const {
    items: listProduct,
    isLoading,
    total,
    mutate,
  } = DokumentasiRepository.hooks.useListProduct({
    query: searchQuery,
    skip,
    limit,
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
    push('dokumentasi/form');
  };

  const onEditButton = (id: number) => {
    push({
      pathname: 'dokumentasi/form',
      query: { id: id, action: 'edit' },
    });
  };

  const onDeleteHandler = async (id: number) => {
    try {
      const result = await DokumentasiRepository.api.delete(id);
      console.log({ result });

      notifications.show({
        title: 'Berhasil',
        message: 'Data berhasil dihapus',
        color: 'green',
      });

      mutate();
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Gagal',
        message,
        color: 'red',
      });
    }
  };

  const onDeleteButton = (id: number) => {
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
        modals.closeAll();
      },
    });
  };

  return (
    <>
      <Card withBorder>
        <Stack gap={'md'}>
          <div id="header-action">
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
                  <Input
                    rightSection={<IconSearch />}
                    placeholder="Cari sesuatu..."
                    value={searchQuery}
                    onChange={onChangeSearch}
                  />
                  <Button rightSection={<IconFilter size="1rem" />} variant="outline" onClick={openModalFilter}>
                    Filter
                  </Button>
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
                  <Button rightSection={<IconPlus />} variant="filled" onClick={onAddButton}>
                    Tambah
                  </Button>
                </Flex>
              </Grid.Col>
            </Grid>
          </div>
          <Stack gap={'md'} id="table">
            <LoadingOverlay visible={isLoading} />
            <Table.ScrollContainer minWidth={500}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>TITLE</Table.Th>
                    <Table.Th>DESCRIPTION</Table.Th>
                    <Table.Th>PRICE</Table.Th>
                    <Table.Th>DISCOUNT</Table.Th>
                    <Table.Th>RATING</Table.Th>
                    <Table.Th>STOCK</Table.Th>
                    <Table.Th>BRAND</Table.Th>
                    <Table.Th>CATEGORY</Table.Th>
                    <Table.Th>THUMBNAIL</Table.Th>
                    <Table.Th>IMAGES</Table.Th>
                    <Table.Th>KONTROL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {listProduct.map((item, index) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.title}</Table.Td>
                        <Table.Td>{item.description}</Table.Td>
                        <Table.Td>{item.price}</Table.Td>
                        <Table.Td>{item.discountPercentage}</Table.Td>
                        <Table.Td>{item.rating}</Table.Td>
                        <Table.Td>{item.stock}</Table.Td>
                        <Table.Td>{item.brand}</Table.Td>
                        <Table.Td>{item.category}</Table.Td>
                        <Table.Td>
                          <Image src={item.thumbnail} alt={item.title} width={100} height={100} />
                        </Table.Td>
                        <Table.Td>
                          <Group gap={'md'} align="center">
                            {item.images.map((image, i) => {
                              return <Image key={i} src={image} alt={item.title} width={60} height={60} />;
                            })}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group>
                            <ButtonEdit onClick={() => onEditButton(item.id)} />
                            <ButtonDelete onClick={() => onDeleteButton(item.id)} />
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
              onChangePagination={setPagination}
              onChangePaginationSize={setSizePagination}
              total={total}
            />
          </Stack>
        </Stack>
      </Card>
      {/* Modal Filter */}
      <Modal
        opened={isModalFilterOpen}
        onClose={closeModalFilter}
        title="Filter"
        size={'md'}
        scrollAreaComponent={ScrollArea.Autosize}
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
      >
        <Stack gap={'sm'}>
          <Group gap={'md'} grow>
            <DatePickerInput
              dropdownType="modal"
              rightSection={<IconCalendar />}
              label="Mulai"
              placeholder="Mulai"
              valueFormat="YYYY-MM-DD"
            />
            <DatePickerInput
              dropdownType="modal"
              rightSection={<IconCalendar />}
              label="Selesai"
              placeholder="Selesai"
              valueFormat="YYYY-MM-DD"
            />
          </Group>
          <Group justify="right">
            <Button onClick={closeModalFilter} variant="default">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
