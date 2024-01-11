import InputSpan from '@/components/InputSpan';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProjectTaskRepository } from '@/features/common/project-task/project-task.repository';
import { DeveloperTaskRepository } from '@/features/developer/task/developer-task.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Group, Button, Radio, LoadingOverlay, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Task">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      description: undefined as string | undefined,
      linkTask: undefined as string | undefined,
      status: 'ON_PROGRESS',
    },
    validate: {
      status: (value) => {
        if (!value) {
          return 'Status tidak boleh kosong';
        }
        return null;
      },
      description: (value) => {
        if (!value) {
          return 'Description tidak boleh kosong';
        }
        return null;
      },
    },
  });
  const { back, query, isReady } = useRouter();
  const { id } = query;
  const { setFieldValue } = form;

  const { data: task, isLoading: isLoadingTask } = ProjectTaskRepository.hooks.useById(id as string | undefined);

  const onSubmit = async (values: any) => {
    try {
      console.log(values);

      const result = await DeveloperTaskRepository.api.updateStatus(id as string, values);
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
        message: message,
        color: 'red',
      });
    }
  };

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (task) {
      console.log({ task });

      setFieldValue('status', task.status);
    }

    return () => {};
  }, [isReady, setFieldValue, task]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingTask} />
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
              Deskripsi Task
            </Card.Section>
            <Stack gap={'md'}>
              <InputSpan label="Deskripsi" content={task?.description} />
            </Stack>
          </Card>
          <Card withBorder>
            <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
              Form
            </Card.Section>
            <Stack gap={'md'}>
              <Textarea label="Description" placeholder="Description" {...form.getInputProps('description')} />
              <TextInput
                label="Link Task"
                placeholder="Link Task"
                description="You can use link from github, gitlab, etc"
                {...form.getInputProps('linkTask')}
              />
              <Radio.Group label="Status" {...form.getInputProps('status')}>
                <Group mt={'sm'}>
                  <Radio value="FINISH" label="Finish" />
                  <Radio value="PENDING" label="Pending" />
                  <Radio value="ON_PROGRESS" label="On Progress" />
                  <Radio value="REVISION" label="Revisi" />
                  <Radio value="CANCEL" label="Cancel" />
                </Group>
              </Radio.Group>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
