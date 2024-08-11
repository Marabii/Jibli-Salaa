export default async function HomePage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <h1>Hello World</h1>;
}
