import AccessModulTransferList, { TransferListDataType } from '@/components/AccessModulTransferList';
import AdminLayout from '@/components/layout/AdminLayout';
import { dummyRole } from '@/utils/dummy_data';
import {
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Input,
  Modal,
  ScrollArea,
  Space,
  Stack,
  Table,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconFileExport, IconFileImport, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
Page.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};

const unselectedModul: TransferListDataType[] = [
  {
    label: 'Modul 1',
    value: '1',
  },
  {
    label: 'Modul 2',
    value: '2',
  },
];

const selectedModul: TransferListDataType[] = [];

export default function Page() {
  const [isOpenModal, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [data, setData] = useState<[TransferListDataType[], TransferListDataType[]]>([unselectedModul, selectedModul]);

  const handleTransfer = (transferFrom: number, options: TransferListDataType[]) => {
    return setData((current) => {
      const transferTo = transferFrom === 0 ? 1 : 0;
      const transferFromData = current[transferFrom].filter((item) => !options.includes(item));
      const transferToData = [...current[transferTo], ...options];

      const result = [];
      result[transferFrom] = transferFromData;
      result[transferTo] = transferToData;
      return result as [TransferListDataType[], TransferListDataType[]];
    });
  };

  const onSubmit = (values: any) => {
    console.log(values);
  };

  const form = useForm({
    initialValues: {
      role: '',
      name: '',
    },
  });

  return (
    <>
      <Stack>
        <Card withBorder>
          <Flex direction={'row'} align={'center'} justify={'space-between'}>
            <Input leftSection={<IconSearch />} placeholder="Cari sesuatu..." />
            <Space w={'lg'} />
            <Group gap={'xs'}>
              <Button leftSection={<IconFileImport />} variant="outline" size="xs">
                Import
              </Button>
              <Button leftSection={<IconFileExport />} variant="outline" size="xs">
                Export
              </Button>
            </Group>
          </Flex>
        </Card>
        <Card withBorder>
          <Table verticalSpacing={'md'} highlightOnHover>
            <thead>
              <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Nama</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyRole.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.status ? <Badge color="green">Aktif</Badge> : <Badge color="red">Tidak Aktif</Badge>}</td>
                    <td>
                      <Group gap={'xs'}>
                        <Button variant="outline" size="xs" color="blue" onClick={openModal}>
                          Edit
                        </Button>
                      </Group>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      </Stack>
      {/* Form Modal Access Modul */}
      {isOpenModal && (
        <Modal
          opened={isOpenModal}
          onClose={closeModal}
          title="Form Akses Modul"
          size={'lg'}
          scrollAreaComponent={ScrollArea.Autosize}
          overlayProps={{
            opacity: 0.55,
            blur: 3,
          }}
        >
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack gap={'md'}>
              <TextInput placeholder="Your name" label="Name" disabled {...form.getInputProps('name')} />
              <TextInput placeholder="Your role" label="Role" disabled {...form.getInputProps('role')} />
              <Group justify="space-between" align="center" style={{ marginTop: 10, marginBottom: 10 }}>
                <AccessModulTransferList
                  options={data[0]}
                  type="forward"
                  onTransfer={(val) => handleTransfer(0, val)}
                />
                <AccessModulTransferList
                  options={data[1]}
                  type="backward"
                  onTransfer={(val) => handleTransfer(1, val)}
                />
              </Group>
              <Group justify="right">
                <Button onClick={closeModal} variant="default">
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      )}
    </>
  );
}
