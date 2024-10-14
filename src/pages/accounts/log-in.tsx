import AuthLayout from "@/modules/accounts/AuthLayout";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

export default function SignUp() {
  return <AuthLayout page="log-in" />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}
