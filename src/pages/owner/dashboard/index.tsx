import CardDashboard from '@/components/dashboard/CardDashboard';
import AdminLayout from '@/components/layout/AdminLayout';
import { OwnerRepository } from '@/features/owner/owner.repository';
import useBreakpoint from '@/hooks/useBreakpoint';
import { baseUrl } from '@/utils/constant';
import { getErrorMessageAxios } from '@/utils/function';
import { Button, Card, Group, LoadingOverlay, Stack } from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import {
  IconBrandZoom,
  IconBulb,
  IconDownload,
  IconFile,
  IconSubtask,
  IconUserCode,
  IconUserExclamation,
  IconUserSquareRounded,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="Dashboard">{page}</AdminLayout>;
};

export default function Page() {
  const { isMobile } = useBreakpoint();
  const [date, setDate] = useState<Date>(new Date());
  const [isLoadingDownloadReport, setIsLoadingDownloadReport] = useState<boolean>(false);
  const { data: dashboard, isLoading } = OwnerRepository.hooks.useResumeDashboard(date.getFullYear());
  const {
    totalTask,
    totalClient,
    totalDocument,
    totalMeeting,
    totalProject,
    totalUserDeveloper,
    totalUserProjectManager,
    statisticDeveloper = [],
    statisticProjectManager = [],
  } = dashboard || {};

  const onDownloadReport = async () => {
    try {
      setIsLoadingDownloadReport(true);

      const { relativePath } = await OwnerRepository.api.downloadReport(date.getFullYear());
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
      <LoadingOverlay visible={isLoading} />
      <Stack gap={'lg'}>
        <Card padding={'md'} radius={'lg'} shadow="sm">
          <Group>
            <div className="grow">
              <Button
                variant="outline"
                rightSection={<IconDownload size={14} />}
                onClick={onDownloadReport}
                loading={isLoadingDownloadReport}
              >
                Download Report
              </Button>
            </div>
            <YearPickerInput placeholder="Pick date" value={date} onChange={(value) => setDate(value as Date)} />
          </Group>
        </Card>

        <div
          className="
      grid grid-cols-1 gap-4 
      md:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
    "
        >
          <CardDashboard
            icon={<IconUserExclamation size={32} />}
            title="Project Manager"
            total={totalUserProjectManager || 0}
            onClickDetail={() => {}}
          />
          <CardDashboard
            icon={<IconUserCode size={32} />}
            title="Developer"
            total={totalUserDeveloper || 0}
            onClickDetail={() => {}}
          />
          <CardDashboard
            icon={<IconUserSquareRounded size={32} />}
            title="Client"
            total={totalClient || 0}
            onClickDetail={() => {}}
          />
          <CardDashboard
            icon={<IconBulb size={32} />}
            title="Project"
            total={totalProject || 0}
            onClickDetail={() => {}}
          />
          <CardDashboard
            icon={<IconSubtask size={32} />}
            title="Task Developer"
            total={totalTask || 0}
            onClickDetail={() => {}}
          />
          <CardDashboard
            icon={<IconFile size={32} />}
            title="Document"
            total={totalDocument || 0}
            onClickDetail={() => {}}
          />

          <CardDashboard
            icon={<IconBrandZoom size={32} />}
            title="Meeting"
            total={totalMeeting || 0}
            onClickDetail={() => {}}
          />
        </div>

        <Card padding={'md'} radius={'lg'}>
          <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
            Statistic Project Developer
          </Card.Section>
          <ResponsiveContainer width={'100%'} height={isMobile ? 300 : 400}>
            <BarChart
              data={statisticProjectManager}
              margin={{
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width={40} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="totalProject"
                name="Project"
                fill="#8884d8"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="totalMeeting"
                name="Meeting"
                fill="#82ca9d"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card padding={'md'} radius={'lg'}>
          <Card.Section withBorder inheritPadding py={'sm'} mb={'sm'}>
            Statistic Developer
          </Card.Section>
          <ResponsiveContainer width={'100%'} height={isMobile ? 300 : 400}>
            <BarChart
              data={statisticDeveloper}
              margin={{
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width={40} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalTask" name="Task" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
              <Bar
                dataKey="totalProject"
                name="Project"
                fill="#82ca9d"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Stack>
    </Stack>
  );
}
