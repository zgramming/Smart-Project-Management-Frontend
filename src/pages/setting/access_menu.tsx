import AdminLayout from '@/components/layout/AdminLayout';
import { MenuV2, ModulV2 } from '@/interface/category_modul';
import { availableAccessAction } from '@/utils/constant';
import { dummmyModulAndMenuV2, dummyRole } from '@/utils/dummy_data';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Checkbox,
  Collapse,
  Flex,
  Group,
  Input,
  Modal,
  Paper,
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  Table,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp, IconFileExport, IconFileImport, IconSearch } from '@tabler/icons-react';

function AccessModulItem({ item }: { item: ModulV2 }) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Card key={item.id} withBorder shadow="md">
      <Stack>
        <Flex direction={'row'} align={'center'} justify={'space-between'}>
          <div className="font-bold">
            {item.name} <Badge>{item.menus?.length} Menu</Badge>
          </div>
          <ActionIcon variant="subtle">
            {opened ? <IconChevronUp onClick={toggle} /> : <IconChevronDown onClick={toggle} />}
          </ActionIcon>
        </Flex>
        <Collapse in={opened}>
          <Space h={'xs'} />
          {item.menus?.map((menu) => {
            return <AccessMenuItem key={menu.id} menu={menu} />;
          })}
        </Collapse>
      </Stack>
    </Card>
  );
}

function AccessMenuItem({ menu }: { menu: MenuV2 }) {
  return (
    <Paper key={menu.id} shadow="xs" p={'md'} mb={'md'}>
      <Stack>
        <div className="font-medium">{menu.name}</div>
        <Checkbox.Group defaultValue={['react']} description="Select your access action" withAsterisk>
          <Group mt="xs">
            {availableAccessAction.map((item) => (
              <Checkbox key={item} value={item} label={item.toUpperCase()} />
            ))}
          </Group>
        </Checkbox.Group>
      </Stack>
    </Paper>
  );
}

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default function Page() {
  const [isOpenModal, { open: openModal, close: closeModal }] = useDisclosure(false);
  const mappingModul = dummmyModulAndMenuV2
    .map((item) => {
      const moduls = item.moduls;
      return moduls;
    })
    .flat();
  const onSubmit = (values: any) => {
    console.log({
      values,
    });
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
      {/* Form Modal Access Menu */}
      {isOpenModal && (
        <Modal
          opened={isOpenModal}
          onClose={closeModal}
          title="Form Akses Menu"
          size={'xl'}
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
              <SimpleGrid cols={1}>
                {mappingModul.map((item) => {
                  return <AccessModulItem key={item.id} item={item} />;
                })}
              </SimpleGrid>
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
