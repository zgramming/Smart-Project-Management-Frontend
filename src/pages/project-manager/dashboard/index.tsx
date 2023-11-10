import CardDashboard from '@/components/dashboard/CardDashboard';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProjectManagerDashboardRepository } from '@/features/project-manager/dashboard/project-manager-dashboard.repository';
import { readableDate } from '@/utils/function';
import { Button, Card, Grid, Group, LoadingOverlay, Stack, Table } from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { IconBrandZoom, IconBulb, IconDownload, IconFile, IconSubtask } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Dashboard">{page}</AdminLayout>;
};

export default function Page() {
  const [date, setDate] = useState<Date>(new Date());

  const { data: resumeDashboard, isLoading: isLoadingResumeDashboard } =
    ProjectManagerDashboardRepository.hooks.useResumeDashboard(date.getFullYear());
  const { projectsWillBeEndSoon, totalDocument, totalMeeting, totalProject, totalTask } = resumeDashboard || {};
  return (
    <Stack gap={'md'}>
      <LoadingOverlay visible={isLoadingResumeDashboard} />
      <Card padding={'md'} radius={'lg'} shadow="sm">
        <Group>
          <div className="grow">
            <Button variant="outline" rightSection={<IconDownload size={14} />}>
              Download Report
            </Button>
          </div>
          <YearPickerInput placeholder="Pick date" value={date} onChange={(value) => setDate(value as Date)} />
        </Group>
      </Card>
      <Grid gutter={'md'} pb={'xs'}>
        <Grid.Col
          span={{
            xs: 12,
            md: 6,
            lg: 3,
          }}
        >
          <CardDashboard
            icon={<IconBulb size={32} />}
            title="Project"
            total={totalProject || 0}
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
            icon={<IconBrandZoom size={32} />}
            title="Meeting"
            total={totalMeeting || 0}
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
            total={totalDocument || 0}
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
            total={totalTask || 0}
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
                {projectsWillBeEndSoon?.map((project) => {
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
