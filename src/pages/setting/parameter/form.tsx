import AdminLayout from '@/components/layout/AdminLayout';
import { ParameterRepository } from '@/features/setting/parameter/parameter.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Textarea, Group, Button, Radio, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Parameter">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      code: '',
      name: '',
      value: '',
      description: undefined as string | undefined,
      status: 'ACTIVE',
    },
    validate: {
      code: (value) => {
        if (!value) {
          return 'Code is required';
        }
        return null;
      },
      name: (value) => {
        if (!value) {
          return 'Name is required';
        }
        return null;
      },
      value: (value) => {
        if (!value) {
          return 'Value is required';
        }
        return null;
      },
      status: (value) => {
        if (!value) {
          return 'Status is required';
        }
        return null;
      },
    },
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const { data: parameter, isLoading: isLoadingParameter } = ParameterRepository.hooks.useById(
    id as string | undefined,
  );

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      if (parameter) {
        const result = await ParameterRepository.api.update(id as string, values);
        notifications.show({
          title: 'Success',
          message: result.message,
          color: 'green',
        });
      } else {
        const result = await ParameterRepository.api.create(values);
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

    if (parameter) {
      setFieldValue('code', parameter.code);
      setFieldValue('name', parameter.name);
      setFieldValue('value', parameter.value);
      setFieldValue('description', parameter.description ? parameter.description : undefined);
      setFieldValue('status', parameter.status);
    }

    return () => {};
  }, [isReady, parameter, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingParameter} />
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
              <TextInput placeholder="Your code" label="Code" withAsterisk {...form.getInputProps('code')} />
              <TextInput placeholder="Your name" label="Name" withAsterisk {...form.getInputProps('name')} />
              <TextInput placeholder="Your value" label="Value" withAsterisk {...form.getInputProps('value')} />
              <Textarea label="Description" placeholder="Description" {...form.getInputProps('description')} />
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
