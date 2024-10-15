import PageHeader from "@/modules/dashboard/shared/PageHeader";
/* import { GetServerSidePropsContext } from "next"; */
import Head from "next/head";
import { getPageTitle } from "@/modules/shared/utils/getPageTitle";
import { Box, Grid2, Stack, TextField, Typography } from "@mui/material";
import { boardTypes, NewBoard, newBoardSchema } from "@/schema/Board";
import { Formik } from "formik";
import useFetch from "@/modules/shared/hooks/useFetch";
import { getBoardTypeInfo } from "@/modules/dashboard/boards/utils/getBoardTypeTitle";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";

const initialValues: NewBoard = {
  title: "",
  description: "",
  type: "product",
};

export default function NewBoards() {
  const { makeRequest } = useFetch();

  const router = useRouter();

  return (
    <>
      <Head>
        <title>{getPageTitle("New board")}</title>
      </Head>

      <Formik
        initialValues={initialValues}
        validationSchema={newBoardSchema}
        validateOnMount
        onSubmit={(values, helpers) => {
          makeRequest(
            "/boards",
            { showSuccessSnackbar: true },
            { method: "POST", body: values }
          )
            .then(() => {
              router.push("");
            })
            .catch((err) => {
              console.log(err);
              helpers.setSubmitting(false);
            });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isValid,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <PageHeader
              title="Create board"
              loadingButtonProps={{
                text: "Create",
                disabled: !isValid,
                loading: isSubmitting,
                type: "submit",
              }}
              excludedLinks={["workspace"]}
            />

            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack spacing={2}>
                  <TextField
                    required
                    label="Board title"
                    fullWidth
                    id="title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />

                  <TextField
                    required
                    label="Board description"
                    multiline
                    rows={6}
                    fullWidth
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Stack>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 4 }}>
                <Box border={1} borderRadius={2} borderColor="divider" p={3}>
                  <Typography mb={2}>Board type *</Typography>

                  {/* TODO: extract to a reusable component */}
                  <Box display="flex" gap={1.5} flexWrap="wrap">
                    {boardTypes.map((type) => {
                      return (
                        <Box
                          key={type}
                          border={1}
                          borderRadius={1}
                          borderColor={
                            values.type === type ? "primary.main" : "divider"
                          }
                          px={2}
                          py={0.5}
                          sx={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setFieldValue("type", type);
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {getBoardTypeInfo(type).label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Grid2>
            </Grid2>
          </form>
        )}
      </Formik>
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

    return {
      props: {},
    };
  } catch (err) {
    throw err;
  }
}
