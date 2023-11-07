import AdminLayout from '@/components/layout/AdminLayout';
import { UserRepository } from '@/features/setting/user/user.repository';
import { getErrorMessageAxios } from '@/utils/function';
import { Stack, Card, TextInput, Group, Button, Radio, MultiSelect, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendar } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

export default function Page() {
  const { back } = useRouter();

  const { data: users } = UserRepository.hooks.useOnlyDeveloperAndProjectManagerRole();
  const form = useForm({
    initialValues: {},
    validate: {},
  });

  const onSubmit = (values: any) => {
    try {
      console.log({ values });

      //   const result = ProjectManagerProjectRepository.api.create(values);
      //   notifications.show({
      //     title: 'Success',
      //     color: 'green',
      //     message: 'Project successfully created',
      //   });
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        color: 'red',
        message,
      });
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
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
                data={[{ value: '1', label: 'Client 1' }]}
                nothingFoundMessage="Client not found"
                searchable
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

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Data Badan Usaha">{page}</AdminLayout>;
