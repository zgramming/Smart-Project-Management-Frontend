import AdminLayout from '@/components/layout/AdminLayout';
import { CategoryModulRepository } from '@/features/setting/category-modul/category-modul.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Textarea, Group, Button, Radio, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Category Modul">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      code: '',
      name: '',
      prefix: '',
      description: '',
      status: 'ACTIVE',
    },
    validate: {
      code: (value) => {
        if (!value) {
          return 'Kode tidak boleh kosong';
        }
        return null;
      },
      name: (value) => {
        if (!value) {
          return 'Nama tidak boleh kosong';
        }
        return null;
      },
      prefix: (value) => {
        if (!value) {
          return 'Prefix tidak boleh kosong';
        }
        return null;
      },
      status: (value) => {
        if (!value) {
          return 'Status tidak boleh kosong';
        }
        return null;
      },
    },
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const { data: dataCategoryModul, isLoading: isLoadingCategoryModul } = CategoryModulRepository.hooks.useById(
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

      if (dataCategoryModul) {
        const result = await CategoryModulRepository.api.update(id as string, values);
        notifications.show({
          title: 'Success',
          color: 'green',
          message: result.message,
        });
      } else {
        const result = await CategoryModulRepository.api.create(values);
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

    if (dataCategoryModul) {
      setFieldValue('code', dataCategoryModul.code);
      setFieldValue('name', dataCategoryModul.name);
      setFieldValue('prefix', dataCategoryModul.prefix);
      setFieldValue('description', dataCategoryModul.description);
      setFieldValue('status', dataCategoryModul.status);
    }

    return () => {};
  }, [dataCategoryModul, isReady, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingCategoryModul} />
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
              <TextInput placeholder="Kode" label="Kode" name="code" withAsterisk {...form.getInputProps('code')} />
              <TextInput placeholder="Nama" label="Nama" name="name" withAsterisk {...form.getInputProps('name')} />
              <TextInput
                placeholder="Prefix"
                label="Prefix"
                name="prefix"
                withAsterisk
                {...form.getInputProps('prefix')}
              />
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
