import { Title, Button, Container, Group, Text } from '@mantine/core';
import classes from '@cssModule/notfound_page.module.css';
import { useRouter } from 'next/router';

export default function NotFoundTitle() {
  const { replace } = useRouter();

  const onClick = () => {
    replace('/');
  };

  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to another
        URL.
      </Text>
      <Group justify="center">
        <Button variant="subtle" size="md" onClick={onClick}>
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}
