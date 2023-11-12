import AdminLayout from '@/components/layout/AdminLayout';
import { RoleRepository } from '@/features/setting/role/role.repository';
import { UserRepository } from '@/features/setting/user/user.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Select, Group, Button, Radio, PasswordInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form User">{page}</AdminLayout>;

export default function Page() {
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';

  const { data: roles } = RoleRepository.hooks.useListRole({
    page: 1,
    pageSize: 1000,
  });
  const { data: user, isLoading: isLoadingUser } = UserRepository.hooks.useById(id as string | undefined);

  const form = useForm({
    initialValues: {
      roleId: '',
      name: '',
      username: '',
      password: undefined,
      status: 'ACTIVE',
    },
    validate: {
      roleId: (value) => {
        if (!value) {
          return 'Role harus diisi';
        }
        return null;
      },
      name: (value) => {
        if (!value) {
          return 'Nama harus diisi';
        }
        return null;
      },
      username: (value) => {
        if (!value) {
          return 'Username harus diisi';
        }
        return null;
      },
      password: (value) => {
        if (user) return null;

        if (!value) {
          return 'Password harus diisi';
        }
        return null;
      },
      status: (value) => {
        if (!value) {
          return 'Status harus diisi';
        }
        return null;
      },
    },
  });

  const { setFieldValue } = form;

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });
      if (user) {
        const result = await UserRepository.api.update(id as string, values);
        notifications.show({
          title: 'Success',
          color: 'green',
          message: result.message,
        });
      } else {
        const result = await UserRepository.api.create(values);
        notifications.show({
          title: 'Success',
          color: 'green',
          message: result.message,
        });
      }

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

    if (user) {
      setFieldValue('roleId', `${user.roleId}`);
      setFieldValue('name', user.name);
      setFieldValue('username', user.username);
      setFieldValue('status', user.status);
    }

    return () => {};
  }, [isReady, setFieldValue, user]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingUser} />
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
              <Select
                label="Role"
                placeholder="Pilih Role"
                data={roles?.map((item) => ({ value: `${item.id}`, label: item.name }))}
                {...form.getInputProps('roleId')}
              />
              <TextInput placeholder="Your name" label="Name" withAsterisk {...form.getInputProps('name')} />
              <TextInput
                placeholder="Your username"
                label="Username"
                withAsterisk
                {...form.getInputProps('username')}
              />

              {!user && (
                <PasswordInput
                  placeholder="Your password"
                  label="Password"
                  withAsterisk
                  {...form.getInputProps('password')}
                />
              )}

              <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                <Group>
                  <Radio value="ACTIVE" label="Active" />
                  <Radio value="INACTIVE" label="Inactive" />
                </Group>
              </Radio.Group>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
