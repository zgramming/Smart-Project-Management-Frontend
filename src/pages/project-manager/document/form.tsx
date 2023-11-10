import ContainerInputFileActionIcon from '@/components/ContainerInputFileActionIcon';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProjectDocumentRepository } from '@/features/common/project-document/project-document.repository';
import { ProjectRepository } from '@/features/common/project/project.repository';
import { getErrorMessageAxios } from '@/utils/function';
import {
  Stack,
  Card,
  Select,
  Group,
  Button,
  TextInput,
  Textarea,
  Radio,
  FileInput,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

Page.getLayout = (page: ReactNode) => <AdminLayout title="Form Data Badan Usaha">{page}</AdminLayout>;

export default function Page() {
  const { back, query, isReady } = useRouter();
  const { id, action } = query;
  const isEdit = action === 'edit';

  const form = useForm({
    initialValues: {
      project_id: '',
      name: '',
      description: '',
      file: '',
      status: 'ACTIVE',
    },
    validate: {
      project_id: (value) => {
        if (!value) {
          return 'Project is required';
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
      file: (value) => {
        if (isEdit) return null;

        if (!value) {
          return 'File is required';
        }

        return null;
      },
    },
  });

  const { setFieldValue } = form;

  const { data: dataDocument, isLoading: isLoadingDocument } = ProjectDocumentRepository.hooks.useById(
    id as string | undefined,
  );
  const { data: dataProject } = ProjectRepository.hooks.useListProject({
    page: 1,
    pageSize: 1000,
  });

  const onSubmit = async (values: any) => {
    try {
      console.log(values);
      const { project_id, name, description, file, status } = values;

      if (isEdit) {
        const formData = new FormData();

        formData.append('projectId', project_id);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('status', status);
        if (file) formData.append('file', file);

        const result = await ProjectDocumentRepository.api.update(id as string, formData);
        notifications.show({
          title: 'Success',
          color: 'green',
          message: result.message,
        });
      } else {
        const formData = new FormData();

        formData.append('projectId', project_id);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('file', file);
        formData.append('status', status);

        const result = await ProjectDocumentRepository.api.create(formData);
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

    if (dataDocument) {
      setFieldValue('project_id', `${dataDocument.projectId}`);
      setFieldValue('name', dataDocument.name);
      if (dataDocument.description) setFieldValue('description', dataDocument.description);
      setFieldValue('status', dataDocument.status);
    }

    return () => {};
  }, [dataDocument, isReady, setFieldValue]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)} encType="multipart/form-data">
        <LoadingOverlay visible={isLoadingDocument} />
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
              <ContainerInputFileActionIcon
                input={
                  <FileInput
                    label="File"
                    placeholder="File"
                    rightSection={<IconUpload />}
                    {...form.getInputProps('file')}
                  />
                }
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
