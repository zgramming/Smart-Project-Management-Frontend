import AdminLayout from '@/components/layout/AdminLayout';
import { ProjectMeetingRepository } from '@/features/common/project-meeting/project-meeting.repository';
import { ProjectRepository } from '@/features/common/project/project.repository';
import { UserRepository } from '@/features/setting/user/user.repository';
import { getErrorMessageAxios } from '@/utils/function';
import {
  Stack,
  Card,
  TextInput,
  Select,
  Textarea,
  Group,
  Button,
  Radio,
  LoadingOverlay,
  MultiSelect,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendar } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Meeting">{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      project_id: '',
      name: '',
      description: '',
      start_date: new Date() || undefined,
      end_date: new Date() || undefined,
      link: '',
      method: 'ONLINE',
      status: 'ACTIVE',
      members: Array<any>(),
    },
    validate: {},
  });
  const { back, query, isReady } = useRouter();
  const { id, action } = query;
  const { setFieldValue } = form;
  const isEdit = action === 'edit';

  const { data: dataMeeting, isLoading: isLoadingMeeting } = ProjectMeetingRepository.hooks.useById(
    id as string | undefined,
  );
  const { data: dataProject } = ProjectRepository.hooks.useListProject({
    page: 1,
    pageSize: 1000,
  });
  const { data: users } = UserRepository.hooks.useListUser();

  const onSubmit = async (values: any) => {
    try {
      console.log(values);
      const members = (values.members as Array<string>).map((item) => ({ userId: parseInt(item) }));
      const body = {
        projectId: parseInt(values.project_id),
        name: values.name,
        description: values.description,
        startDate: values.start_date,
        endDate: values.end_date,
        link: values.link,
        method: values.method,
        status: values.status,
        members,
      };

      if (isEdit) {
        const result = await ProjectMeetingRepository.api.update(id as string, body);
        notifications.show({
          title: 'Success',
          message: result.message,
          color: 'blue',
        });
      } else {
        const result = await ProjectMeetingRepository.api.create(body);

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
        color: 'red',
        message,
      });
    }
  };

  useEffect(() => {
    if (!isReady) return;

    if (dataMeeting) {
      setFieldValue('project_id', `${dataMeeting.projectId}`);
      setFieldValue('name', dataMeeting.name);
      if (dataMeeting.description) setFieldValue('description', dataMeeting.description);
      setFieldValue('start_date', new Date(dataMeeting.startDate));
      setFieldValue('end_date', new Date(dataMeeting.endDate));
      setFieldValue('link', dataMeeting.link);
      setFieldValue('method', dataMeeting.method);
      setFieldValue('status', dataMeeting.status);
      const members = dataMeeting.ProjectMeetingMember.map((item) => `${item.userId}`);
      setFieldValue('members', members);
    }

    return () => {};
  }, [dataMeeting, isReady, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingMeeting} />
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
              <TextInput
                label="Link"
                placeholder="Link"
                description="If you pick Online Meeting, you must fill with link like Zoom, Google Meet, etc. If you pick Offline Meeting, you must fill with link like Google Maps, etc."
                {...form.getInputProps('link')}
              />
              <Radio.Group label="Method" {...form.getInputProps('method')}>
                <Group mt={'sm'}>
                  <Radio value="ONLINE" label="Online" />
                  <Radio value="OFFLINE" label="Offline" />
                </Group>
              </Radio.Group>

              <MultiSelect
                label="Members"
                placeholder="Members"
                data={users?.map((item) => ({ value: `${item.id}`, label: `${item.role.name} - ${item.name}` })) || []}
                nothingFoundMessage="Members not found"
                searchable
                {...form.getInputProps('members')}
              />

              <Radio.Group label="Status" {...form.getInputProps('status')}>
                <Group mt={'sm'}>
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
