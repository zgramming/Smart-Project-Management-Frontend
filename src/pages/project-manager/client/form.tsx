import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { ProjectClientRepository } from '@/features/common/project-client/project-client.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Textarea, Group, Button, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title={'Form Client'}>{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      description: '',
    },
    validate: {
      name: (value) => {
        if (!value) {
          return 'Name is required';
        }
        return null;
      },
      code: (value) => {
        if (!value) {
          return 'Code is required';
        }
        return null;
      },
      description: (value) => {
        if (!value) {
          return 'Description is required';
        }
        return null;
      },
    },
  });

  const authCtx = useContext(AuthenticationContext);
  const { back, query, isReady } = useRouter();
  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const {
    data: client,
    isLoading: isLoadingClient,
    mutate: reloadClient,
  } = ProjectClientRepository.hooks.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      if (isEdit) {
        const body = {
          ...values,
        };
        const result = await ProjectClientRepository.api.update(id as string, body);
        notifications.show({
          title: 'Success',
          color: 'green',
          message: result.message,
        });
      } else {
        const body = {
          ...values,
          createdBy: authCtx.jwtPayload?.sub,
        };
        const result = await ProjectClientRepository.api.create(body);
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
        color: 'red',
        message: message,
      });
    }
  };

  useEffect(() => {
    if (!isReady) return;

    // Reload data
    if (isEdit && client) {
      setFieldValue('name', client.name);
      setFieldValue('code', client.code);
      if (client.description) {
        setFieldValue('description', client.description);
      }
    }
    return () => {};
  }, [client, isEdit, isReady, reloadClient, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingClient} />
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
              <TextInput label="Name" placeholder="Name" {...form.getInputProps('name')} />
              <TextInput label="Code" placeholder="Code" {...form.getInputProps('code')} />
              <Textarea label="Description  " placeholder="Description    " {...form.getInputProps('description')} />
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
