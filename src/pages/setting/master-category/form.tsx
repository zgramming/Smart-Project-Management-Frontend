import AdminLayout from '@/components/layout/AdminLayout';
import { MasterCategoryRepository } from '@/features/setting/master-category/master-category.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Select, Textarea, Group, Button, Radio, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Master Category">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      parentMasterCategoryId: undefined as string | undefined,
      code: '',
      name: '',
      description: '',
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
  const { setFieldValue, values } = form;
  const { data: dataMasterCategory, isLoading: isLoadingMasterCategory } = MasterCategoryRepository.hooks.useById(
    id as string | undefined,
  );
  const { data: dataMasterCategoryList = [] } = MasterCategoryRepository.hooks.useList({
    page: 1,
    pageSize: 100,
  });

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      if (dataMasterCategory) {
        const result = await MasterCategoryRepository.api.update(id as string, values);
        notifications.show({
          title: 'Success',
          color: 'green',
          message: result.message,
        });
      } else {
        const result = await MasterCategoryRepository.api.create(values);
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

    if (dataMasterCategory) {
      setFieldValue('parentMasterCategoryId', dataMasterCategory.parentMasterCategoryId);
      setFieldValue('code', dataMasterCategory.code);
      setFieldValue('name', dataMasterCategory.name);
      setFieldValue('description', dataMasterCategory.description);
      setFieldValue('status', dataMasterCategory.status);
    }

    return () => {};
  }, [dataMasterCategory, isReady, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingMasterCategory} />
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
                key={values.parentMasterCategoryId}
                label="Parent Category"
                placeholder="Pick Parent Category"
                clearable
                searchable
                data={dataMasterCategoryList.map((item) => ({ value: `${item.id}`, label: item.name }))}
                {...form.getInputProps('parentMasterCategoryId')}
              />
              <TextInput placeholder="Your code" label="Code" withAsterisk {...form.getInputProps('code')} />
              <TextInput placeholder="Your name" label="Name" withAsterisk {...form.getInputProps('name')} />
              <Textarea
                placeholder="Your description"
                label="Description"
                withAsterisk
                {...form.getInputProps('description')}
              />
              <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                <Group>
                  <Radio value="ACTIVE" label="ACTIVE" />
                  <Radio value="INACTIVE" label="INACTIVE" />
                </Group>
              </Radio.Group>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
