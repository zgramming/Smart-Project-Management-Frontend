import AdminLayout from '@/components/layout/AdminLayout';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { ProjectTaskHistoryRepository } from '@/features/common/project-task-history/project-task-history.repository';
import { ProjectTaskRepository } from '@/features/common/project-task/project-task.repository';
import { ProjectRepository } from '@/features/common/project/project.repository';
import { UserRepository } from '@/features/setting/user/user.repository';
import { getErrorMessageAxios, readableDate } from '@/utils/function';
import { Stack, Card, Group, Button, LoadingOverlay, Select, TextInput, Textarea, Radio, Table } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendar } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Task">{page}</AdminLayout>;

export default function Page() {
  const authCtx = useContext(AuthenticationContext);
  const form = useForm({
    initialValues: {
      user_id: '',
      project_id: '',
      name: '',
      description: undefined as string | undefined,
      start_date: new Date() || undefined,
      end_date: new Date() || undefined,
      difficulty: 'EASY',
      status: 'PENDING',
      approve_status: 'PENDING',
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
      approve_status: (value) => {
        if (!value) return 'Approve is required';
        return null;
      },
    },
  });
  const { back, query, isReady } = useRouter();
  const { id, action } = query;
  const isEdit = action === 'edit';
  const { setFieldValue } = form;

  const { data: dataTask, isLoading: isLoadingTask } = ProjectTaskRepository.hooks.useById(id as string | undefined);
  const { data: taskHistory, isLoading: isLoadingTaskHistory } = ProjectTaskHistoryRepository.hooks.useListTaskHistory(
    id as string | undefined,
  );
  const { data: dataProject } = ProjectRepository.hooks.useListProject({
    page: 1,
    pageSize: 1000,
  });
  const { data: users } = UserRepository.hooks.useOnlyDeveloperAndProjectManagerRole();

  const onSubmit = async (values: any) => {
    try {
      const { project_id, user_id, name, description, start_date, end_date, difficulty, status, approve_status } =
        values;

      const userLoginId = authCtx.jwtPayload?.sub || 0;

      if (isEdit) {
        const result = await ProjectTaskRepository.api.update(id as string, {
          projectId: parseInt(project_id),
          userId: parseInt(user_id),
          endDate: end_date,
          startDate: start_date,
          name,
          description,
          degreeOfDifficulty: difficulty,
          status,
          approveStatus: approve_status,
          updatedBy: userLoginId,
        });

        notifications.show({
          title: 'Success',
          message: result.message,
          color: 'green',
        });
      } else {
        const result = await ProjectTaskRepository.api.create({
          projectId: parseInt(project_id),
          userId: parseInt(user_id),
          endDate: end_date,
          startDate: start_date,
          name,
          description,
          degreeOfDifficulty: difficulty,
          status,
          approveStatus: approve_status,
          createdBy: userLoginId,
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
      if (dataTask.description) setFieldValue('description', dataTask.description);
      setFieldValue('start_date', new Date(dataTask.startDate));
      setFieldValue('end_date', new Date(dataTask.endDate));
      setFieldValue('difficulty', dataTask.degreeOfDifficulty);
      setFieldValue('status', dataTask.status);
      setFieldValue('approve_status', dataTask.approveStatus);
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
          {taskHistory && (
            <Card withBorder>
              <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
                Developer Task Histories
              </Card.Section>
              <Stack gap={'md'}>
                <Table.ScrollContainer minWidth={500}>
                  <LoadingOverlay visible={isLoadingTaskHistory} />
                  <Table verticalSpacing={'md'}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>NO</Table.Th>
                        <Table.Th>LINK TASK</Table.Th>
                        <Table.Th>DESCRIPTION</Table.Th>
                        <Table.Th>STATUS</Table.Th>
                        <Table.Th>CREATED AT</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {taskHistory.map((item, index) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>{index + 1}</Table.Td>
                          <Table.Td>
                            <Link href={item.linkTask}>{item.linkTask}</Link>
                          </Table.Td>
                          <Table.Td>{item.description}</Table.Td>
                          <Table.Td>{item.status}</Table.Td>
                          <Table.Td>{readableDate(item.createdAt, 'DD MMMM YYYY HH:mm')}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              </Stack>
            </Card>
          )}
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
                  <Radio value="REVISION" label="Revisi" />
                  <Radio value="CANCEL" label="Cancel" />
                </Group>
              </Radio.Group>
            </Stack>
          </Card>
          <Card withBorder>
            <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
              Approval
            </Card.Section>
            <Stack gap={'md'}>
              <Radio.Group label="Approve" {...form.getInputProps('approve_status')}>
                <Group mt={'sm'}>
                  <Radio value="APPROVED" label="Approve" />
                  <Radio value="PENDING" label="Pending" />
                  <Radio value="REJECTED" label="Rejected" />
                </Group>
              </Radio.Group>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
