import AdminLayout from '@/components/layout/AdminLayout';
import { MasterDataRepository } from '@/features/setting/master-data/master-data.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Textarea, Group, Button, Radio, Divider, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Master Data">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      code: '',
      name: '',
      description: undefined as string | undefined,
      status: 'ACTIVE',
      parameter1_key: undefined as string | undefined,
      parameter1_value: undefined as string | undefined,
      parameter2_key: undefined as string | undefined,
      parameter2_value: undefined as string | undefined,
      parameter3_key: undefined as string | undefined,
      parameter3_value: undefined as string | undefined,
    },
    validate: {
      code: (value) => {
        if (!value) {
          return 'Code is required';
        }
        return true;
      },
      name: (value) => {
        if (!value) {
          return 'Name is required';
        }
        return true;
      },
      status: (value) => {
        if (!value) {
          return 'Status is required';
        }
        return true;
      },
    },
  });
  const { back, query, isReady } = useRouter();

  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const { data: dataMasterData, isLoading: isLoadingMasterData } = MasterDataRepository.hooks.useById(
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

      const body = {
        code: values.code,
        name: values.name,
        description: values.description,
        status: values.status,
        parameter1_key: values.parameter1_key,
        parameter1_value: values.parameter1_value,
        parameter2_key: values.parameter2_key,
        parameter2_value: values.parameter2_value,
        parameter3_key: values.parameter3_key,
        parameter3_value: values.parameter3_value,
        masterCategoryCode: query.masterCategoryCode as string,
      };

      if (dataMasterData) {
        const result = await MasterDataRepository.api.update(id as string, {
          ...body,
        });

        notifications.show({
          title: 'Success',
          color: 'green',
          message: result.message,
        });
      } else {
        const result = await MasterDataRepository.api.create({
          ...body,
        });

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

    if (dataMasterData) {
      setFieldValue('code', dataMasterData.code);
      setFieldValue('name', dataMasterData.name);
      setFieldValue('description', dataMasterData.description);
      setFieldValue('status', dataMasterData.status);
      setFieldValue('parameter1_key', dataMasterData.parameter1_key);
      setFieldValue('parameter1_value', dataMasterData.parameter1_value);
      setFieldValue('parameter2_key', dataMasterData.parameter2_key);
      setFieldValue('parameter2_value', dataMasterData.parameter2_value);
      setFieldValue('parameter3_key', dataMasterData.parameter3_key);
      setFieldValue('parameter3_value', dataMasterData.parameter3_value);
    }

    return () => {};
  }, [dataMasterData, isReady, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingMasterData} />
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
              <TextInput
                placeholder="Your code"
                label="Code"
                withAsterisk
                readOnly
                variant="filled"
                {...form.getInputProps('code')}
              />
              <TextInput placeholder="Your name" label="Name" withAsterisk {...form.getInputProps('name')} />
              <Textarea
                placeholder="Your Description"
                label="Description"
                withAsterisk
                {...form.getInputProps('description')}
              />
              <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                <Group>
                  <Radio value="ACTIVE" label="Active" />
                  <Radio value="INACTIVE" label="Inactive" />
                </Group>
              </Radio.Group>
              <Divider />
              <Stack gap={'md'}>
                <div className="font-semibold text-2xl">Parameter</div>
                {Array.from({ length: 3 })
                  .fill(0)
                  .map((_, index) => {
                    return (
                      <Group key={index} gap={'xs'} grow>
                        <TextInput
                          placeholder={`Key ${index + 1}`}
                          label={`Key ${index + 1}`}
                          {...form.getInputProps(`parameter${index + 1}_key`)}
                        />
                        <TextInput
                          placeholder={`Value ${index + 1}`}
                          label={`Value ${index + 1}`}
                          {...form.getInputProps(`parameter${index + 1}_value`)}
                        />
                      </Group>
                    );
                  })}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
