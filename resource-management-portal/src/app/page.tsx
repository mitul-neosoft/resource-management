import { Button, Container, Title } from "@mantine/core";

export default function HomePage() {
  return (
    <Container py="xl">
      <Title order={1}>Resource Management Portal</Title>

      <Button mt="md">Get Started</Button>
    </Container>
  );
}
