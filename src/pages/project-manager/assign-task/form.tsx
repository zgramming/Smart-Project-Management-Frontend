import AdminLayout from '@/components/layout/AdminLayout';
import { ProjectManagerProjectRepository } from '@/features/project-manager/project/project-manager-project.repository';
import { ProjectManagerTaskRepository } from '@/features/project-manager/task/project-manager-task.repository';
import { UserRepository } from '@/features/setting/user/user.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, Group, Button, LoadingOverlay, Select, TextInput, Textarea, Radio } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendar } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Task">{page}</AdminLayout>;

export default function Page() {
  const { back, query, isReady } = useRouter();
  const { id, action } = query;
  const isEdit = action === 'edit';

  const form = useForm({
    initialValues: {
      user_id: '',
      project_id: '',
      name: '',
      description: '',
      start_date: new Date() || undefined,
      end_date: new Date() || undefined,
      difficulty: 'EASY',
      status: 'PENDING',
    },
    validate: {
      user_id: (value) => {
        if (!value) return 'Assign To is required';
        return null;
      },
      project_id: (value) => {
        if (!value) return 'Project is required';
        return null;
      },
      name: (value) => {
        if (!value) return 'Title is required';
        return null;
      },
      start_date: (value) => {
        if (!value) return 'Start Date is required';
        return null;
      },
      end_date: (value) => {
        if (!value) return 'End Date is required';
        return null;
      },
      difficulty: (value) => {
        if (!value) return 'Difficulty is required';
        return null;
      },
      status: (value) => {
        if (!value) return 'Status is required';
        return null;
      },
    },
  });

  const { setFieldValue } = form;

  const { data: dataTask, isLoading: isLoadingTask } = ProjectManagerTaskRepository.hooks.useById(
    id as string | undefined,
  );
  const { data: dataProject } = ProjectManagerProjectRepository.hooks.useListProject({
    page: 1,
    pageSize: 1000,
  });
  const { data: users } = UserRepository.hooks.useListUser();

  const onSubmit = async (values: any) => {
    try {
      const { project_id, user_id, name, description, start_date, end_date, difficulty, status } = values;

      if (isEdit) {
        const result = await ProjectManagerTaskRepository.api.update(id as string, {
          projectId: parseInt(project_id),
          userId: parseInt(user_id),
          endDate: end_date,
          startDate: start_date,
          name,
          description,
          degreeOfDifficulty: difficulty,
          status,
        });

        notifications.show({
          title: 'Success',
          message: result.message,
          color: 'green',
        });
      } else {
        const result = await ProjectManagerTaskRepository.api.create({
          projectId: parseInt(project_id),
          userId: parseInt(user_id),
          endDate: end_date,
          startDate: start_date,
          name,
          description,
          degreeOfDifficulty: difficulty,
          status,
        });

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
        message: message,
        color: 'red',
      });
    }
  };

  useEffect(() => {
    if (!isReady) return;

    if (dataTask) {
      setFieldValue('user_id', `${dataTask.userId}`);
      setFieldValue('project_id', `${dataTask.projectId}`);
      setFieldValue('name', dataTask.name);
      setFieldValue('description', dataTask.description);
      setFieldValue('start_date', new Date(dataTask.startDate));
      setFieldValue('end_date', new Date(dataTask.endDate));
      setFieldValue('difficulty', dataTask.degreeOfDifficulty);
      setFieldValue('status', dataTask.status);
    }
    return () => {};
  }, [dataTask, isReady, setFieldValue]);

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
              Form
            </Card.Section>
            <Stack gap={'md'}>
              <Select
                label="Project"
                placeholder="Pick Project"
                data={dataProject?.map((item) => ({
                  value: `${item.id}`,
                  label: `${item.ProjectClient.name} - ${item.name}`,
                }))}
                nothingFoundMessage="No options"
                searchable
                clearable
                {...form.getInputProps('project_id')}
              />
              <Select
                label="Assign To"
                placeholder="Pick User"
                data={users?.map((item) => ({
                  value: `${item.id}`,
                  label: `${item.role.name} - ${item.name}`,
                }))}
                nothingFoundMessage="No options"
                searchable
                clearable
                {...form.getInputProps('user_id')}
              />
              <TextInput label="Title" placeholder="Title" {...form.getInputProps('name')} />
              <Textarea label="Description" placeholder="Description" {...form.getInputProps('description')} />
              <DateTimePicker
                rightSection={<IconCalendar />}
                label="Start Date"
                placeholder="Start Date"
                valueFormat="YYYY-MM-DD HH:mm"
                {...form.getInputProps('start_date')}
              />
              <DateTimePicker
                rightSection={<IconCalendar />}
                label="End Date"
                placeholder="End Date"
                valueFormat="YYYY-MM-DD HH:mm"
                {...form.getInputProps('end_date')}
              />
              <Radio.Group label="Difficulty" {...form.getInputProps('difficulty')}>
                <Group mt={'sm'}>
                  <Radio value="EASY" label="Easy" />
                  <Radio value="MEDIUM" label="Medium" />
                  <Radio value="HARD" label="Hard" />
                  <Radio value="VERY_HARD" label="Very Hard" />
                </Group>
              </Radio.Group>
              <Radio.Group label="Status" {...form.getInputProps('status')}>
                <Group mt={'sm'}>
                  <Radio value="FINISH" label="Finish" />
                  <Radio value="PENDING" label="Pending" />
                  <Radio value="ON_PROGRESS" label="On Progress" />
                  <Radio value="NEED_HELP" label="Need Help !" />
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
