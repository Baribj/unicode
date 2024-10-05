import Head from "next/head";

export default function Home() {
  return (
    <Head>
      <title>UNICODE</title>
      <meta
        name="description"
        content="A light, simple, and elegant task management tool, "
      />
    </Head>
  );
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/dashboard",
      permanent: true,
    },
  };
}
