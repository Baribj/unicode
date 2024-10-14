import { SignUpRequest, signUpRequestSchema } from "@/schema/User";
import { LoadingButton } from "@mui/lab";
import { Grid2, Stack, TextField } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import useFetch from "../shared/hooks/useFetch";
import { signIn } from "next-auth/react";

interface SignUpFormValues extends SignUpRequest {
  passwordConfirmation: string;
}

const initialValues: SignUpFormValues = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

const singUpFromSchema: Yup.ObjectSchema<SignUpFormValues> =
  signUpRequestSchema.concat(
    Yup.object()
      .required()
      .strict()
      .noUnknown()
      .shape({
        passwordConfirmation: Yup.string()
          .required("Password is required")
          .min(8, "Password must be at least 8 characters long")
          .oneOf([Yup.ref("password")], "Passwords don't match"),
      })
  );

export default function SignUpForm() {
  const { makeRequest } = useFetch();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={singUpFromSchema}
      validateOnMount
      onSubmit={(values, helpers) => {
        const { passwordConfirmation, ...reqBody } = values;

        makeRequest(
          "auth/sign-up",
          {
            showSuccessSnackbar: true,
          },
          { method: "POST", body: reqBody }
        )
          .then((res) => {
            signIn("credentials", {
              email: values.email,
              password: values.password,
              redirect: true,
              callbackUrl: "/dashboard",
            });
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
        handleSubmit,
        isValid,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} mb={4}>
            <TextField
              required
              fullWidth
              label="Name"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              slotProps={{
                inputLabel: {
                  sx: {
                    typography: "body2",
                  },
                },
                input: {
                  sx: {
                    typography: "body2",
                  },
                },
              }}
            />

            <TextField
              required
              fullWidth
              label="Email Address"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              slotProps={{
                inputLabel: {
                  sx: {
                    typography: "body2",
                  },
                },
                input: {
                  sx: {
                    typography: "body2",
                  },
                },
              }}
            />

            <div>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    required
                    type="password"
                    fullWidth
                    label="Password"
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    slotProps={{
                      inputLabel: {
                        sx: {
                          typography: "body2",
                        },
                      },
                      input: {
                        sx: {
                          typography: "body2",
                        },
                      },
                    }}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    required
                    type="password"
                    fullWidth
                    label="Confirm password"
                    id="password-confirmation"
                    name="passwordConfirmation"
                    value={values.passwordConfirmation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.passwordConfirmation &&
                      Boolean(errors.passwordConfirmation)
                    }
                    helperText={
                      touched.passwordConfirmation &&
                      errors.passwordConfirmation
                    }
                    slotProps={{
                      inputLabel: {
                        sx: {
                          typography: "body2",
                        },
                      },
                      input: {
                        sx: {
                          typography: "body2",
                        },
                      },
                    }}
                  />
                </Grid2>
              </Grid2>
            </div>
          </Stack>

          <LoadingButton
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disableElevation
            disabled={!isValid}
            loading={isSubmitting}
          >
            Join
          </LoadingButton>
        </form>
      )}
    </Formik>
  );
}
