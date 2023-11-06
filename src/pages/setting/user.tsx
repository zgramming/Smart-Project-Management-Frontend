import AdminLayout from '@/components/layout/AdminLayout';
import { dummyRole, dummyUser } from '@/utils/dummy_data';
import {
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Input,
  Modal,
  PasswordInput,
  Radio,
  ScrollArea,
  Select,
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
      role: '',
      name: '',
      username: '',
      password: '',
      status: 'aktif',
    },
    validate: {
      name: (value) => {
        if (!value) {
          return 'Nama harus diisi';
        }
        if (value.trim().length < 3) {
          return 'Minimal 3 karakter';
        }
        if (value.trim().length > 10) {
          return 'Maksimal 10 karakter';
        }
        return null;
      },
      username: (value) => {
        if (!value) {
          return 'Username harus diisi';
        }
        if (value.trim().length < 3) {
          return 'Minimal 3 karakter';
        }
        if (value.trim().length > 10) {
          return 'Maksimal 10 karakter';
        }
        return null;
      },
      password: (value) => {
        if (!value) {
          return 'Password harus diisi';
        }
        if (value.trim().length < 3) {
          return 'Minimal 3 karakter';
        }
        if (value.trim().length > 10) {
          return 'Maksimal 10 karakter';
        }
        return null;
      },
      role: (value) => {
        if (!value) {
          return 'Role harus diisi';
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
            <Group gap={'xs'}>
              <Input rightSection={<IconSearch />} placeholder="Cari sesuatu..." />
              <Select
                placeholder="Pilih Role"
                data={dummyRole.map((item) => ({ value: `${item.id}`, label: item.name }))}
              />
            </Group>
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
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>No</th>
                <th>Role</th>
                <th>Nama</th>
                <th>Username</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyUser.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.role}</td>
                    <td>{item.name}</td>
                    <td>{item.username}</td>
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
      {/* Form Modal User */}
      {isOpenModal && (
        <Modal
          opened={isOpenModal}
          onClose={closeModal}
          title="Form User"
          size={'md'}
          scrollAreaComponent={ScrollArea.Autosize}
          overlayProps={{
            opacity: 0.55,
            blur: 3,
          }}
        >
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack gap={'md'}>
              <Select
                label="Role"
                placeholder="Pilih Role"
                data={dummyRole.map((item) => ({ value: `${item.id}`, label: item.name }))}
                {...form.getInputProps('role')}
              />
              <TextInput placeholder="Your name" label="Name" withAsterisk {...form.getInputProps('name')} />
              <TextInput
                placeholder="Your username"
                label="Username"
                withAsterisk
                {...form.getInputProps('username')}
              />
              <PasswordInput
                placeholder="Your password"
                label="Password"
                withAsterisk
                {...form.getInputProps('password')}
              />
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
