import AdminLayout from '@/components/layout/AdminLayout';
import { ProjectClientRepository } from '@/features/common/project-client/project-client.repository';
import { ProjectRepository } from '@/features/common/project/project.repository';
import { UserRepository } from '@/features/setting/user/user.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Group, Button, Radio, MultiSelect, Select, LoadingOverlay } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendar } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title={'Form Project'}>{page}</AdminLayout>;

export default function Page() {
  const form = useForm({
    initialValues: {
      client_id: '',
      name: '',
      code: '',
      start_date: new Date() || undefined,
      end_date: new Date() || undefined,
      members: Array<any>(),
      status: 'ACTIVE',
    },
    validate: {
      client_id: (value) => {
        if (!value) {
          return 'Client is required';
        }
        return null;
      },
      name: (value) => {
        if (!value) {
          return 'Name is required';
        }
        return null;
      },
      code: (value) => {
        if (!value) {
          return 'Code is required';
        }
        return null;
      },

      start_date: (value) => {
        if (!value) {
          return 'Start Date is required';
        }
        return null;
      },

      end_date: (value) => {
        if (!value) {
          return 'End Date is required';
        }
        return null;
      },

      members: (value: Array<any>) => {
        if (value.length === 0) {
          return 'Members is required';
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

  const { data: project, isLoading: isLoadingProject } = ProjectRepository.hooks.useById(id as string | undefined);
  const { data: users } = UserRepository.hooks.useOnlyDeveloperAndProjectManagerRole();
  const { data: clients } = ProjectClientRepository.hooks.useListClient({
    page: 1,
    pageSize: 1000,
  });

  const onSubmit = async (values: any) => {
    try {
      console.log({ values });
      const members = (values.members as Array<string>).map((item) => ({ userId: parseInt(item) }));
      const body = {
        clientId: values.client_id,
        name: values.name,
        code: values.code,
        startDate: values.start_date,
        endDate: values.end_date,
        members: members,
        status: values.status,
      };
      if (isEdit) {
        const result = await ProjectRepository.api.update(id as string, body);
        notifications.show({
          title: 'Success',
          color: 'green',
          message: result.message,
        });
      } else {
        const result = await ProjectRepository.api.create(body);
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
        color: 'red',
        message,
      });
    }
  };

  useEffect(() => {
    if (!isReady) return;

    if (project) {
      setFieldValue('client_id', `${project.clientId}`);
      setFieldValue('name', project.name);
      setFieldValue('code', project.code);
      setFieldValue('start_date', new Date(project.startDate));
      setFieldValue('end_date', new Date(project.endDate));
      setFieldValue(
        'members',
        project.ProjectMember.map((item) => `${item.userId}`),
      );
      setFieldValue('status', project.status);
    }

    return () => {};
  }, [isReady, project, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoadingProject} />
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
                label="Client"
                placeholder="Pick Client"
                data={[...(clients?.map((item) => ({ value: `${item.id}`, label: `${item.name}` })) || [])]}
                nothingFoundMessage="Client not found"
                searchable
                {...form.getInputProps('client_id')}
              />
              <TextInput label="Name" placeholder="Name" {...form.getInputProps('name')} />
              <TextInput label="Code" placeholder="Code" {...form.getInputProps('code')} />
              <DateInput
                rightSection={<IconCalendar />}
                label="Start Date"
                placeholder="Start Date"
                valueFormat="YYYY-MM-DD"
                {...form.getInputProps('start_date')}
              />
              <DateInput
                rightSection={<IconCalendar />}
                label="End Date"
                placeholder="End Date"
                valueFormat="YYYY-MM-DD"
                {...form.getInputProps('end_date')}
              />

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
                  <Radio value="SUSPEND" label="Suspend" />
                  <Radio value="FINISH" label="Finish" />
                </Group>
              </Radio.Group>
            </Stack>
          </Card>
        </Stack>
      </form>
    </>
  );
}
