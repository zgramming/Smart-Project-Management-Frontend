import AdminLayout from '@/components/layout/AdminLayout';
import { RoleRepository } from '@/features/setting/role/role.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Textarea, Group, Button, Radio, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Role">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      description: '',
      status: 'ACTIVE',
    },
    validate: {},
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;
  const { data: role, isLoading: isLoadingRole } = RoleRepository.hooks.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      if (role) {
        // update
        const result = await RoleRepository.api.update(id as string, values);

        notifications.show({
          title: 'Success',
          message: result.message,
          color: 'green',
        });
      } else {
        // create
        const result = await RoleRepository.api.create(values);

        notifications.show({
          title: 'Success',
          message: result.message,
          color: 'green',
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

    if (role) {
      setFieldValue('name', role.name);
      setFieldValue('code', role.code);
      setFieldValue('description', role.description);
      setFieldValue('status', role.status);
    }

    return () => {};
  }, [isReady, role, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingRole} />
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
              Form
            </Card.Section>
            <Stack gap={'md'}>
              <TextInput placeholder="Your name" label="Name" withAsterisk {...form.getInputProps('name')} />
              <TextInput placeholder="Your code" label="Code" withAsterisk {...form.getInputProps('code')} />
              <Textarea label="Description" placeholder="Description" {...form.getInputProps('description')} />
              <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                <Group>
                  <Radio value="ACTIVE" label="Active" />
                  <Radio value="INACTIVE" label="InActive" />
                </Group>
              </Radio.Group>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
