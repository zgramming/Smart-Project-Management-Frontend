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
  Radio,
  ScrollArea,
  Space,
  Stack,
  Table,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconFileExport, IconFileImport, IconPlus, IconSearch } from '@tabler/icons-react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default function Page() {
  const [isOpenModal, { open: openModal, close: closeModal }] = useDisclosure(false);

  const onSubmit = (values: any) => {
    console.log(values);
  };

  const form = useForm({
    initialValues: {
      code: '',
      name: '',
      status: 'aktif',
    },
    validate: {
      code: (value) => {
        if (value.trim().length < 3) {
          return 'Minimal 3 karakter';
        }
        if (value.trim().length > 10) {
          return 'Maksimal 10 karakter';
        }
        return null;
      },
      name: (value) => {
        if (value.trim().length < 3) {
          return 'Minimal 3 karakter';
        }
        if (value.trim().length > 10) {
          return 'Maksimal 10 karakter';
        }
        return null;
      },
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
              <Button leftSection={<IconPlus />} variant="filled" size="xs" onClick={openModal}>
                Tambah
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
                <th>Value</th>
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
                    <td>{item.name}</td>
                    <td>{item.status ? <Badge color="green">Aktif</Badge> : <Badge color="red">Tidak Aktif</Badge>}</td>
                    <td>
                      <Group gap={'xs'}>
                        <Button variant="outline" size="xs" color="blue" onClick={openModal}>
                          Edit
                        </Button>
                        <Button variant="outline" size="xs" color="red">
                          Hapus
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
      {/* Form Modal Parameter   */}
      {isOpenModal && (
        <Modal
          opened={isOpenModal}
          onClose={closeModal}
          title="Form Parameter "
          size={'md'}
          scrollAreaComponent={ScrollArea.Autosize}
          overlayProps={{
            opacity: 0.55,
            blur: 3,
          }}
        >
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack gap={'md'}>
              <TextInput placeholder="Your code" label="Code" withAsterisk {...form.getInputProps('code')} />
              <TextInput placeholder="Your name" label="Name" withAsterisk {...form.getInputProps('name')} />
              <TextInput placeholder="Your value" label="Value" withAsterisk {...form.getInputProps('value')} />
              <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                <Group>
                  <Radio value="aktif" label="Aktif" />
                  <Radio value="tidak_aktif" label="Tidak Aktif" />
                </Group>
              </Radio.Group>
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
