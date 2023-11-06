import { useEffect } from 'react';

import { MantineColorsTuple, createTheme, MantineProvider } from '@mantine/core';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { breakpoint } from '@/utils/constant';
import { useRouter } from 'next/router';

function RouteTransition() {
  const { asPath, events } = useRouter();

  useEffect(() => {
    const handleStart = (url: string) => url !== asPath && nprogress.start();
    const handleComplete = () => nprogress.complete();
    events.on('routeChangeStart', handleStart);
    events.on('routeChangeComplete', handleComplete);
    events.on('routeChangeError', handleComplete);
    return () => {
      events.off('routeChangeStart', handleStart);
      events.off('routeChangeComplete', handleComplete);
      events.off('routeChangeError', handleComplete);
    };
  }, [asPath, events]);

  return <NavigationProgress />;
}

const myColor: MantineColorsTuple = [
  '#ebfff3',
  '#d5fee5',
  '#a5fdc8',
  '#72fda9',
  '#4ffd8e',
  '#3efd7d',
  '#35fe75',
  '#2ae263',
  '#1ec856',
  '#00ad47',
];

const theme = createTheme({
  fontFamily: 'Poppins, sans-serif',
  headings: {
    fontFamily: 'Poppins, sans-serif',
  },
  black: '#404040',
  primaryColor: 'myColor',
  breakpoints: {
    xs: breakpoint.xs,
    sm: breakpoint.sm,
    md: breakpoint.md,
    lg: breakpoint.lg,
    xl: breakpoint.xl,
  },
  colors: {
    myColor,
  },
});

function MantineCustomProvider({ children }: any) {
  return (
    <MantineProvider defaultColorScheme={'light'} theme={theme}>
      <ModalsProvider>
        <RouteTransition />
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}

export default MantineCustomProvider;
