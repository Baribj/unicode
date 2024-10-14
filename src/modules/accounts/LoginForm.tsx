import { logInRequestSchema, signUpRequestSchema } from "@/schema/User";
import { LoadingButton } from "@mui/lab";
import { Stack, TextField } from "@mui/material";
import { Formik } from "formik";
import useFetch from "../shared/hooks/useFetch";
import { signIn } from "next-auth/react";

const initialValues = {
  email: "",
  password: "",
};

export default function LoginForm() {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={logInRequestSchema}
      validateOnMount
      onSubmit={(values, helpers) => {
        signIn("credentials", {
          ...values,
          redirect: true,
          callbackUrl: "/dashboard",
        })
          .then((res) => {})
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
              label="Email address"
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

            <TextField
              required
              fullWidth
              type="password"
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
            Log In
          </LoadingButton>
        </form>
      )}
    </Formik>
  );
}
