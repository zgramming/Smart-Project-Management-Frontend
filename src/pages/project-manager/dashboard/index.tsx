import CardDashboard from '@/components/dashboard/CardDashboard';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProjectManagerDashboardRepository } from '@/features/project-manager/dashboard/project-manager-dashboard.repository';
import { baseUrl } from '@/utils/constant';
import { getErrorMessageAxios, readableDate } from '@/utils/function';
import { Alert, Button, Card, Grid, Group, List, LoadingOverlay, Stack, Table } from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconBrandZoom, IconBulb, IconDownload, IconFile, IconInfoCircle, IconSubtask } from '@tabler/icons-react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Dashboard">{page}</AdminLayout>;
};

export default function Page() {
  const [date, setDate] = useState<Date>(new Date());
  const [isDownloadReport, setIsDownloadReport] = useState<boolean>(false);

  const { data: resumeDashboard, isLoading: isLoadingResumeDashboard } =
    ProjectManagerDashboardRepository.hooks.useResumeDashboard(date.getFullYear());
  const {
    projectsWillBeEndSoon = [],
    newUpdateFromAssignedTaskToYouToday = [],
    totalDocument = 0,
    totalMeeting = 0,
    totalProject = 0,
    totalTask = 0,
  } = resumeDashboard || {};

  const isHaveNewUpdateFromAssignedTaskToYouToday = newUpdateFromAssignedTaskToYouToday.length > 0;

  const onDownloadReport = async () => {
    try {
      setIsDownloadReport(true);
      const { relativePath } = await ProjectManagerDashboardRepository.api.downloadReport(date.getFullYear());

      const path = `${baseUrl}/${relativePath}`;
      window.open(path, '_blank');

      notifications.show({
        title: 'Success',
        message: 'Download report success',
        color: 'green',
      });
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    } finally {
      setIsDownloadReport(false);
    }
  };

  return (
    <Stack gap={'md'}>
      <LoadingOverlay visible={isLoadingResumeDashboard} />
      <Card padding={'md'} radius={'lg'} shadow="sm">
        <Group>
          <div className="grow">
            <Button
              variant="outline"
              rightSection={<IconDownload size={14} />}
              loading={isDownloadReport}
              onClick={onDownloadReport}
            >
              Download Report
            </Button>
          </div>
          <YearPickerInput placeholder="Pick date" value={date} onChange={(value) => setDate(value as Date)} />
        </Group>
      </Card>
      {isHaveNewUpdateFromAssignedTaskToYouToday && (
        <Alert
          variant="filled"
          color="blue"
          title={`${newUpdateFromAssignedTaskToYouToday.length} New Update From Assigned Task To You Today`}
          icon={<IconInfoCircle />}
        >
          <List type="ordered">
            {newUpdateFromAssignedTaskToYouToday.map((item) => {
              return (
                <List.Item key={item.id}>
                  <Link
                    href={`/project-manager/assign-task/form?id=${item.id}&action=edit`}
                    className="text-white decoration-white"
                  >
                    {item.Project.name} - {item.name}
                  </Link>
                </List.Item>
              );
            })}
          </List>
        </Alert>
      )}
      <Grid gutter={'md'} pb={'xs'}>
        <Grid.Col
          span={{
            xs: 12,
            md: 6,
            lg: 3,
          }}
        >
          <CardDashboard icon={<IconBulb size={32} />} title="Project" total={totalProject} onClickDetail={() => {}} />
        </Grid.Col>
        <Grid.Col
          span={{
            xs: 12,
            md: 6,
            lg: 3,
          }}
        >
          <CardDashboard
            icon={<IconBrandZoom size={32} />}
            title="Meeting"
            total={totalMeeting}
            onClickDetail={() => {}}
          />
        </Grid.Col>
        <Grid.Col
          span={{
            xs: 12,
            md: 6,
            lg: 3,
          }}
        >
          <CardDashboard
            icon={<IconFile size={32} />}
            title="Document"
            total={totalDocument}
            onClickDetail={() => {}}
          />
        </Grid.Col>
        <Grid.Col
          span={{
            xs: 12,
            md: 6,
            lg: 3,
          }}
        >
          <CardDashboard
            icon={<IconSubtask size={32} />}
            title="Task Developer"
            total={totalTask}
            onClickDetail={() => {}}
          />
        </Grid.Col>
      </Grid>
      <Stack gap={'md'}>
        <div
          className="font-semibold text-base
          lg:text-xl
        "
        >
          Project will be end soon 1 month from now
        </div>
        <Card padding={'md'} radius={'lg'} m={0} shadow="sm">
          <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
            Statistic Project Developer
          </Card.Section>

          <Table.ScrollContainer minWidth={700}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Project Name</Table.Th>
                  <Table.Th>Deadline</Table.Th>
                  <Table.Th>Remaining Days</Table.Th>
                  <Table.Th>Progress</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {projectsWillBeEndSoon.map((project) => {
                  const diffInDays = dayjs(project.endDate).diff(dayjs(), 'days');

                  return (
                    <Table.Tr key={project.id}>
                      <Table.Td>{project.name}</Table.Td>
                      <Table.Td>{readableDate(project.endDate, 'dddd, DD MMMM YYYY')}</Table.Td>
                      <Table.Td>{`${diffInDays} Days`}</Table.Td>
                      <Table.Td>{project.status}</Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </Stack>
    </Stack>
  );
}
