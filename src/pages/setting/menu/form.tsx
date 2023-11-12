import AdminLayout from '@/components/layout/AdminLayout';
import { MenuRepository } from '@/features/setting/menu/menu.repository';
import { ModulRepository } from '@/features/setting/modul/modul.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Select, Textarea, Group, Button, Radio, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Menu">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      modulId: '',
      parentMenuId: '' as string | undefined,
      code: '',
      name: '',
      prefix: '',
      description: '',
      status: 'ACTIVE',
    },
    validate: {
      modulId: (value) => {
        if (!value) {
          return 'Modul harus diisi';
        }
        return null;
      },
      code: (value) => {
        if (!value) {
          return 'Code harus diisi';
        }

        return null;
      },
      name: (value) => {
        if (!value) {
          return 'Name harus diisi';
        }

        return null;
      },
      prefix: (value) => {
        if (!value) {
          return 'Prefix harus diisi';
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
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue, values, setValues } = form;
  const { data: dataMenu, isLoading: isLoadingMenu } = MenuRepository.hooks.useById(id as string | undefined);

  const { data: dataModul } = ModulRepository.hooks.useList({
    page: 1,
    pageSize: 1000,
  });

  const { data: dataParentMenu } = MenuRepository.hooks.useByModulId(values.modulId ? values.modulId : undefined);
  const onChangeModul = (value: string | null) => {
    console.log({ value });

    // Set value to modulId and reset parentMenuId
    setValues({
      parentMenuId: undefined,
      modulId: value ? value : '',
    });
  };

  const onSubmit = async (values: any) => {
    try {
      console.log({
        id,
        values,
        isEdit,
        setFieldValue,
      });

      if (dataMenu) {
        const result = await MenuRepository.api.update(id as string, values);
        notifications.show({
          title: 'Success',
          message: result.message,
          color: 'green',
        });
      } else {
        const result = await MenuRepository.api.create(values);
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

    if (dataMenu) {
      console.log('setfiel');

      setValues({
        modulId: `${dataMenu.modulId}`,
        parentMenuId: dataMenu.parentMenuId ? `${dataMenu.parentMenuId}` : undefined,
        code: dataMenu.code,
        name: dataMenu.name,
        prefix: dataMenu.prefix,
        description: dataMenu.description,
        status: dataMenu.status,
      });
    }

    return () => {};
  }, [dataMenu, isReady, setValues]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingMenu} />
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
                label="Modul"
                placeholder="Pick Modul"
                data={dataModul?.map((item) => ({ value: `${item.id}`, label: item.name }))}
                {...form.getInputProps('modulId')}
                onChange={onChangeModul}
              />
              <Select
                // To re-render depend of values.modulId
                key={values.modulId}
                label="Parent Menu"
                placeholder="Pick Parent Menu"
                data={dataParentMenu?.map((item) => ({ value: `${item.id}`, label: item.name })) ?? []}
                searchable
                clearable
                {...form.getInputProps('parentMenuId')}
              />
              <TextInput
                placeholder="Your code"
                label="Code"
                name="code"
                withAsterisk
                {...form.getInputProps('code')}
              />
              <TextInput
                placeholder="Your name"
                label="Name"
                name="name"
                withAsterisk
                {...form.getInputProps('name')}
              />
              <TextInput
                placeholder="Your prefix"
                description="This is need for determine / flag url of the menu"
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
