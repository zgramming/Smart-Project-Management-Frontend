import AdminLayout from '@/components/layout/AdminLayout';
import { AccessMenuRepository } from '@/features/setting/access-menu/access-menu.repository';
import { AccessMenuUpdateAccessDTO } from '@/features/setting/access-menu/dto/access-menu-update-access.dto';
import { AccessModulRepository } from '@/features/setting/access-modul/access-modul.repository';
import { RoleRepository } from '@/features/setting/role/role.repository';
import { availableAccessAction } from '@/utils/constant';
import { AccessMenuAllowedEnum } from '@/utils/enum';
import { getErrorMessageAxios } from '@/utils/function';
import {
  Stack,
  Card,
  TextInput,
  Group,
  Button,
  Checkbox,
  SimpleGrid,
  LoadingOverlay,
  ActionIcon,
  Badge,
  Collapse,
  Flex,
  Paper,
  Space,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

interface AccessModulItemProps {
  form: any;
  modulId: string;
  modulName: string;
  totalMenu: number;
  menus: {
    menuId: string;
    menuName: string;
  }[];
}

interface AccessMenuItemProps {
  form: any;
  modulId: string;
  menuId: string;
  menuName: string;
}

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Access Menu">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      role: '',
      code: '',
    },
    validate: {},
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const { data: dataRole } = RoleRepository.hooks.useById(id as string | undefined);
  const { data: dataAccessMenu = [], isLoading: isLoadingAccessMenu } = AccessMenuRepository.hooks.useByRole(
    id as string | undefined,
  );
  const { data: dataAccessModulByRole = [] } = AccessModulRepository.hooks.useByRole(id as string | undefined);

  const moduls = dataAccessModulByRole.map((item) => {
    return item.Modul;
  });

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      if (!dataAccessMenu) return;

      const body: AccessMenuUpdateAccessDTO[] = [];
      // Get values access menu with key starts with access_menu
      const accessMenu = Object.keys(values)
        .filter((key) => key.startsWith('access_menu'))
        .map((key) => values[key]);

      // Push to body
      accessMenu.forEach((item: string[]) => {
        // Get modulId and menuId from first item in array and convert to number
        const [moduleId, menuId] = item[0].split('-').map(Number);
        // Get allowed access from all item in array
        const allowedAccess = item.map((permission) => permission.split('-')[2]);

        body.push({
          roleId: parseInt(id as string),
          modulId: moduleId,
          menuId: menuId,
          allowedAccess: allowedAccess as AccessMenuAllowedEnum[],
        });
      });

      const result = await AccessMenuRepository.api.updateAccess(body);

      notifications.show({
        title: 'Success',
        message: result.message,
        color: 'green',
      });

      back();
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    }
  };

  useEffect(() => {
    if (!isReady) return;

    if (dataAccessMenu) {
      if (dataRole) {
        setFieldValue('role', dataRole.name);
        setFieldValue('code', dataRole.code);
      }

      dataAccessMenu.forEach((item) => {
        const { modulId, menuId, allowedAccess } = item;

        const values: string[] = [];
        allowedAccess.forEach((access) => {
          values.push(`${modulId}-${menuId}-${access}`);
        });

        setFieldValue(`access_menu-${menuId}`, values);
      });
    }

    return () => {};
  }, [dataAccessMenu, dataRole, isReady, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingAccessMenu} />
        <Stack gap={'xl'}>
          <Card withBorder>
            <Group justify="right">
              <Button onClick={back} variant="default">
                Kembali
              </Button>
              <Button type="submit">Simpan</Button>
            </Group>
          </Card>
          <Card withBorder>
            <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
              Card Section
            </Card.Section>
            <Stack gap={'md'}>
              <TextInput placeholder="Your role" label="Role" disabled {...form.getInputProps('role')} />
              <TextInput placeholder="Your code" label="Code" disabled {...form.getInputProps('code')} />
              <SimpleGrid cols={1}>
                {moduls.map((item) => {
                  const mappingMenu = item.Menu.map((menu) => ({
                    menuId: `${menu.id}`,
                    menuName: menu.name,
                  }));
                  return (
                    <AccessModulItem
                      key={item.id}
                      form={form}
                      menus={mappingMenu}
                      modulId={`${item.id}`}
                      modulName={item.name}
                      totalMenu={item.Menu.length}
                    />
                  );
                })}
              </SimpleGrid>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}

function AccessModulItem({ modulId, modulName, totalMenu, menus, form }: AccessModulItemProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Card key={modulId} withBorder shadow="md">
      <Stack>
        <Flex direction={'row'} align={'center'} justify={'space-between'}>
          <div className="font-bold">
            {modulName} <Badge>{totalMenu} Menu</Badge>
          </div>
          <ActionIcon variant="subtle">
            {opened ? <IconChevronUp onClick={toggle} /> : <IconChevronDown onClick={toggle} />}
          </ActionIcon>
        </Flex>
        <Collapse in={opened}>
          <Space h={'xs'} />
          {menus.map((menu) => {
            return (
              <AccessMenuItem
                key={menu.menuId}
                form={form}
                modulId={modulId}
                menuId={menu.menuId}
                menuName={menu.menuName}
              />
            );
          })}
        </Collapse>
      </Stack>
    </Card>
  );
}

function AccessMenuItem({ modulId, menuId, menuName, form }: AccessMenuItemProps) {
  return (
    <Paper key={menuId} shadow="xs" p={'md'} mb={'md'}>
      <Stack>
        <div className="font-medium">{menuName}</div>
        <Checkbox.Group
          description="Select your access action"
          withAsterisk
          {...form.getInputProps(`access_menu-${menuId}`)}
        >
          <Group mt="xs">
            {availableAccessAction.map((item) => {
              const value = `${modulId}-${menuId}-${item}`;
              return <Checkbox key={value} value={value} label={item.toUpperCase()} />;
            })}
          </Group>
        </Checkbox.Group>
      </Stack>
    </Paper>
  );
}
