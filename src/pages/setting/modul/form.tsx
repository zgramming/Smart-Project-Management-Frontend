import AdminLayout from '@/components/layout/AdminLayout';
import { CategoryModulRepository } from '@/features/setting/category-modul/category-modul.repository';
import { ModulRepository } from '@/features/setting/modul/modul.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Group, Button, Radio, Select, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Modul">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      categoryModulId: '',
      code: '',
      name: '',
      prefix: '',
      status: 'ACTIVE',
    },
    validate: {
      categoryModulId: (value) => {
        if (!value) {
          return 'Category Modul tidak boleh kosong';
        }
        return null;
      },
      code: (value) => {
        if (!value) {
          return 'Code tidak boleh kosong';
        }
        return null;
      },
      name: (value) => {
        if (!value) {
          return 'Name tidak boleh kosong';
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
  const { data: dataCategoryModul } = CategoryModulRepository.hooks.useList({
    page: 1,
    pageSize: 100,
  });
  const { data: dataModul, isLoading: isLoadingModul } = ModulRepository.hooks.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      if (dataModul) {
        const result = await ModulRepository.api.update(id as string, values);
        notifications.show({
          title: 'Success',
          message: result?.message,
          color: 'green',
        });
      } else {
        const result = await ModulRepository.api.create(values);
        notifications.show({
          title: 'Success',
          message: result?.message,
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

    if (dataModul) {
      setFieldValue('code', dataModul.code);
      setFieldValue('name', dataModul.name);
      setFieldValue('prefix', dataModul.prefix);
      setFieldValue('status', dataModul.status);
      setFieldValue('categoryModulId', `${dataModul.categoryModulId}`);
    }

    return () => {};
  }, [dataModul, isReady, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingModul} />
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
              <Select
                label="Category Modul"
                placeholder="Pick Category Modul"
                data={[...(dataCategoryModul?.map((item) => ({ value: `${item.id}`, label: `${item.name}` })) || [])]}
                nothingFoundMessage="No options"
                searchable
                {...form.getInputProps('categoryModulId')}
              />
              <TextInput placeholder="Code" label="Code" name="code" withAsterisk {...form.getInputProps('code')} />
              <TextInput placeholder="Name" label="Name" name="name" withAsterisk {...form.getInputProps('name')} />
              <TextInput
                placeholder="Prefix"
                label="Prefix"
                name="prefix"
                withAsterisk
                {...form.getInputProps('prefix')}
              />
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
