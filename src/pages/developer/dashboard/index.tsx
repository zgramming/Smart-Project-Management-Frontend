import CardDashboard from '@/components/dashboard/CardDashboard';
import AdminLayout from '@/components/layout/AdminLayout';
import { DeveloperDashboardRepository } from '@/features/developer/dashboard/developer-dashboard.repository';
import { readableDate } from '@/utils/function';
import { Button, Card, Grid, Group, LoadingOverlay, Stack, Table } from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import {
  IconBattery1Filled,
  IconBattery2Filled,
  IconBattery3Filled,
  IconBattery4Filled,
  IconBellCancel,
  IconBellCheck,
  IconBellCode,
  IconBellOff,
  IconBellQuestion,
  IconBellRinging,
  IconBellZ,
  IconBrandZoom,
  IconBulb,
  IconDownload,
  IconSubtask,
  IconUserSquareRounded,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Dashboard">{page}</AdminLayout>;
};

export default function Page() {
  const [date, setDate] = useState<Date>(new Date());

  const { data: resumeDashboard, isLoading: isLoadingResumeDashboard } =
    DeveloperDashboardRepository.hooks.useResumeDashboard(date.getFullYear());

  const {
    meetingWillBeHeld,
    totalClient,
    totalMeeting,
    totalProject,
    totalProjectActive,
    totalProjectFinish,
    totalProjectInactive,
    totalProjectSuspend,
    totalTask,
    totalTaskDifficultyEasy,
    totalTaskDifficultyHard,
    totalTaskDifficultyMedium,
    totalTaskDifficultyVeryHard,
    totalTaskStatusCancel,
    totalTaskStatusFinish,
    totalTaskStatusInProgress,
    totalTaskStatusNeedHelp,
    totalTaskStatusPending,
  } = resumeDashboard || {};

  const now = new Date();
  const nowPlusSevenDays = new Date(new Date().setDate(now.getDate() + 7));
  const textMeetingWillBeHeld = `${readableDate(now, 'DD MMMM YYYY')} - ${readableDate(
    nowPlusSevenDays,
    'DD MMMM YYYY',
  )}`;
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

      <Card padding={'md'} radius={'lg'} shadow="sm">
        <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
          Meeting will be held in next 7 days. ({textMeetingWillBeHeld})
        </Card.Section>
        <Table.ScrollContainer minWidth={700}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Client</Table.Th>
                <Table.Th>Project</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Start Date</Table.Th>
                <Table.Th>Remaining Days</Table.Th>
                <Table.Th>Method</Table.Th>
                <Table.Th>Link</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {meetingWillBeHeld?.map((item) => {
                let textRemainingTime = '';
                const diffInDays = dayjs(item.startDate).diff(now, 'day');
                const diffInHours = dayjs(item.startDate).diff(now, 'hour');
                if (diffInDays > 0) {
                  textRemainingTime = `${diffInDays} Days ${diffInHours} Hours`;
                } else {
                  textRemainingTime = `${diffInHours} Hours`;
                }
                return (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.Project.ProjectClient.name}</Table.Td>
                    <Table.Td>{item.Project.name}</Table.Td>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{readableDate(item.startDate, 'DD MMMM YYYY - H:m')}</Table.Td>
                    <Table.Td>{textRemainingTime}</Table.Td>
                    <Table.Td>{item.method}</Table.Td>
                    <Table.Td>
                      <Link href={item.link} target="_blank">
                        {item.link}
                      </Link>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
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
            icon={<IconUserSquareRounded size={32} />}
            title="Client"
            total={totalClient || 0}
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
      </Grid>

      <Card padding={'md'} radius={'lg'} shadow="sm">
        <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
          Project Section
        </Card.Section>
        <Stack gap={'md'}>
          <Stack gap={'md'}>
            <div className="font-semibold text-xl">Summary</div>
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
                  title="Total Project"
                  total={totalProject || 0}
                  onClickDetail={() => {}}
                />
              </Grid.Col>
            </Grid>
          </Stack>
          <Stack gap={'md'}>
            <div className="font-semibold text-lg">Status</div>
            <Grid gutter={'md'} pb={'xs'}>
              <Grid.Col
                span={{
                  xs: 12,
                  md: 6,
                  lg: 3,
                }}
              >
                <CardDashboard
                  icon={<IconBellRinging size={32} />}
                  title="Active"
                  total={totalProjectActive || 0}
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
                  icon={<IconBellCheck size={32} />}
                  title="Finish"
                  total={totalProjectFinish || 0}
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
                  icon={<IconBellOff size={32} />}
                  title="Inactive"
                  total={totalProjectInactive || 0}
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
                  icon={<IconBellCancel size={32} />}
                  title="Suspend"
                  total={totalProjectSuspend || 0}
                  onClickDetail={() => {}}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Stack>
      </Card>

      <Card padding={'md'} radius={'lg'} shadow="sm">
        <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
          Task Section
        </Card.Section>
        <Stack gap={'md'}>
          <Stack gap={'md'}>
            <div className="font-semibold text-xl">Summary</div>
            <Grid gutter={'md'} pb={'xs'}>
              <Grid.Col
                span={{
                  xs: 12,
                  md: 6,
                  lg: 3,
                }}
              >
                <CardDashboard
                  icon={<IconSubtask size={32} />}
                  title="Total Task"
                  total={totalTask || 0}
                  onClickDetail={() => {}}
                />
              </Grid.Col>
            </Grid>
          </Stack>
          <Stack gap={'md'}>
            <div className="font-semibold text-lg">Status</div>
            <Grid gutter={'md'} pb={'xs'}>
              <Grid.Col
                span={{
                  xs: 12,
                  md: 6,
                  lg: 3,
                }}
              >
                <CardDashboard
                  icon={<IconBellCheck size={32} />}
                  title="Finish"
                  total={totalTaskStatusFinish || 0}
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
                  icon={<IconBellCancel size={32} />}
                  title="Cancel"
                  total={totalTaskStatusCancel || 0}
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
                  icon={<IconBellCode size={32} />}
                  title="In Progress"
                  total={totalTaskStatusInProgress || 0}
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
                  icon={<IconBellQuestion size={32} />}
                  title="Need Help"
                  total={totalTaskStatusNeedHelp || 0}
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
                  icon={<IconBellZ size={32} />}
                  title="Pending"
                  total={totalTaskStatusPending || 0}
                  onClickDetail={() => {}}
                />
              </Grid.Col>
            </Grid>
          </Stack>
          <Stack gap={'md'}>
            <div className="font-semibold text-lg">Difficulty</div>
            <Grid gutter={'md'} pb={'xs'}>
              <Grid.Col
                span={{
                  xs: 12,
                  md: 6,
                  lg: 3,
                }}
              >
                <CardDashboard
                  icon={<IconBattery1Filled size={32} />}
                  title="Easy"
                  total={totalTaskDifficultyEasy || 0}
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
                  icon={<IconBattery2Filled size={32} />}
                  title="Medium"
                  total={totalTaskDifficultyMedium || 0}
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
                  icon={<IconBattery3Filled size={32} />}
                  title="Hard"
                  total={totalTaskDifficultyHard || 0}
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
                  icon={<IconBattery4Filled size={32} />}
                  title="Very Hard"
                  total={totalTaskDifficultyVeryHard || 0}
                  onClickDetail={() => {}}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
