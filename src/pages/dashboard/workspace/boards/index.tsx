import PageHeader from "@/modules/dashboard/shared/PageHeader";
/* import { GetServerSidePropsContext } from "next"; */
import Head from "next/head";
import { getPageTitle } from "@/modules/shared/utils/getPageTitle";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Grid2 } from "@mui/material";
import { Board } from "@/schema/Board";
import BoardCard from "@/modules/dashboard/boards/BoardCard";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";

interface Props {
  boards: Board[];
}

export default function Boards({ boards }: Props) {
  return (
    <>
      <Head>
        <title>{getPageTitle("Boards")}</title>
      </Head>

      <PageHeader
        title="Boards"
        loadingButtonProps={{
          text: "Create",
          href: "/dashboard/workspace/boards/new",
          startIcon: <AddRoundedIcon />,
        }}
        excludedLinks={["workspace"]}
      />

      <Grid2 container spacing={4}>
        {boards.map((board) => {
          return (
            <Grid2 key={board.id} size={{ xs: 12, md: 6, xl: 4 }}>
              <BoardCard {...board} />
            </Grid2>
          );
        })}
      </Grid2>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: "/accounts/log-in",
          permanent: false,
        },
      };
    }

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "boards");

    if (!response.ok) {
      throw new Error();
    }

    const data = await response.json();

    const boards = data.result;

    return {
      props: {
        boards,
      },
    };
  } catch (err) {
    throw err;
  }
}

const boards = [
  {
    id: "1",
    title: "The Ultimate Product Design Hub The Ultimate Product Design Hub",
    description:
      "Your vision, our innovation. This board is dedicated to creating the most groundbreaking product.",
    user: {
      id: "11",
      name: "Ahmed",
    },
    type: "engineering",
    createdAt: "15-05-2024",
  },
  {
    id: "2",
    title: "The Ultimate Product Design Hub",
    description:
      "Your vision, our innovation. This board is dedicated to creating the most groundbreaking product.",
    user: {
      id: "11",
      name: "Ahmed",
    },
    type: "product",
    createdAt: "15-05-2024",
  },
  {
    id: "3",
    title: "The Ultimate Product Design Hub",
    description:
      "Your vision, our innovation. This board is dedicated to creating the most groundbreaking product. Your vision, our innovation. This board is dedicated to creating the most groundbreaking product. Your vision, our innovation. This board is dedicated to creating the most groundbreaking product. Your vision, our innovation. This board is dedicated to creating the most groundbreaking product. Your vision, our innovation. This board is dedicated to creating the most groundbreaking product.",
    user: {
      id: "11",
      name: "Ahmed",
    },
    type: "design",
    createdAt: "15-05-2024",
  },
  {
    id: "4",
    title: "The Ultimate Product Design Hub",
    description:
      "Your vision, our innovation. This board is dedicated to creating the most groundbreaking product.",
    user: {
      id: "11",
      name: "Ahmed",
    },
    type: "qa",
    createdAt: "15-05-2024",
  },
];
