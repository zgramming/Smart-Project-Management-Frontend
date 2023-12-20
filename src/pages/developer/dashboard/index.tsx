import CardDashboard from '@/components/dashboard/CardDashboard';
import AdminLayout from '@/components/layout/AdminLayout';
import { DeveloperDashboardRepository } from '@/features/developer/dashboard/developer-dashboard.repository';
import { baseUrl } from '@/utils/constant';
import { getErrorMessageAxios, readableDate } from '@/utils/function';
import { Alert, Button, Card, Grid, Group, List, LoadingOverlay, Stack, Table } from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
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
  IconInfoCircle,
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
  const [isLoadingDownloadReport, setIsLoadingDownloadReport] = useState<boolean>(false);
  const { data: resumeDashboard, isLoading: isLoadingResumeDashboard } =
    DeveloperDashboardRepository.hooks.useResumeDashboard(date.getFullYear());

  const {
    totalClient = 0,
    totalMeeting = 0,
    totalProject = 0,
    totalProjectActive = 0,
    totalProjectFinish = 0,
    totalProjectInactive = 0,
    totalProjectSuspend = 0,
    totalTask = 0,
    totalTaskDifficultyEasy = 0,
    totalTaskDifficultyHard = 0,
    totalTaskDifficultyMedium = 0,
    totalTaskDifficultyVeryHard = 0,
    totalTaskStatusCancel = 0,
    totalTaskStatusFinish = 0,
    totalTaskStatusInProgress = 0,
    totalTaskStatusRevision = 0,
    totalTaskStatusPending = 0,
    meetingWillBeHeld = [],
    newTaskAssignedToYou = [],
  } = resumeDashboard || {};

  const now = new Date();
  const nowPlusSevenDays = new Date(new Date().setDate(now.getDate() + 7));
  const textMeetingWillBeHeld = `${readableDate(now, 'DD MMMM YYYY')} - ${readableDate(
    nowPlusSevenDays,
    'DD MMMM YYYY',
  )}`;

  const isHaveNewTaskAssignedToYou = newTaskAssignedToYou.length > 0;

  const onDownloadReport = async () => {
    try {
      setIsLoadingDownloadReport(true);

      const { relativePath } = await DeveloperDashboardRepository.api.downloadReport(date.getFullYear());
      const path = `${baseUrl}/${relativePath}`;
      notifications.show({
        title: 'Success',
        message: 'Download report success',
        color: 'green',
      });
      window.open(path, '_blank');
    } catch (error) {
      const message = getErrorMessageAxios(error);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    } finally {
      setIsLoadingDownloadReport(false);
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
              loading={isLoadingDownloadReport}
              onClick={onDownloadReport}
            >
              Download Report
            </Button>
          </div>
          <YearPickerInput placeholder="Pick date" value={date} onChange={(value) => setDate(value as Date)} />
        </Group>
      </Card>

      {isHaveNewTaskAssignedToYou && (
        <Alert
          variant="filled"
          color="blue"
          title={`${newTaskAssignedToYou.length} New Task Assigned To You`}
          icon={<IconInfoCircle />}
        >
          <List type="ordered">
            {newTaskAssignedToYou.map((item) => {
              return (
                <List.Item key={item.id}>
                  <Link
                    href={`/developer/task/form?id=${item.id}&action=update`}
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
              {meetingWillBeHeld.map((item) => {
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
            total={totalClient}
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
            total={totalMeeting}
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
                  total={totalProject}
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
                  total={totalProjectActive}
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
                  total={totalProjectFinish}
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
                  total={totalProjectInactive}
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
                  total={totalProjectSuspend}
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
                  total={totalTask}
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
                  total={totalTaskStatusFinish}
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
                  total={totalTaskStatusCancel}
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
                  total={totalTaskStatusInProgress}
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
                  title="Revision"
                  total={totalTaskStatusRevision}
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
                  total={totalTaskStatusPending}
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
                  total={totalTaskDifficultyEasy}
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
                  total={totalTaskDifficultyMedium}
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
                  total={totalTaskDifficultyHard}
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
                  total={totalTaskDifficultyVeryHard}
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
