import ContainedDialog from "@/modules/shared/components/dialogs/ContainedDialog";
import DialogWrapper from "@/modules/shared/components/dialogs/DialogWrapper";
import useFetch from "@/modules/shared/hooks/useFetch";
import { Board } from "@/schema/Board";
import { NewTask, newTaskSchema, Task } from "@/schema/Task";
import { TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useMemo } from "react";

export interface TaskDialogProps {
  title: string;
  onClose: () => void;
  board: Board;
}

function getInitialValues(boardId: string): NewTask {
  return {
    boardId: boardId,
    title: "",
    description: "",
  };
}

export default function TaskDialog(props: TaskDialogProps) {
  const { makeRequest } = useFetch();

  const router = useRouter();

  const initialValues = useMemo(() => {
    return getInitialValues(props.board.id);
  }, [props.board.id]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={newTaskSchema}
      onSubmit={(values, helpers) => {
        makeRequest(
          "/tasks",
          { showSuccessSnackbar: true },
          { method: "POST", body: values }
        )
          .then((res) => {
            props.onClose();
            router.replace(`/dashboard/workspace/boards/${props.board.id}`);
          })
          .catch((err) => {
            console.log(err);
            helpers.setSubmitting(false);
          });
      }}
      validateOnMount
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isValid,
        handleSubmit,
        isSubmitting,
        submitForm,
      }) => (
        <ContainedDialog
          open={true}
          {...props}
          confirmButtonProps={{
            loading: isSubmitting,
            disabled: !isValid,
            onClick: () => {
              submitForm();
            },
          }}
        >
          <form>
            <TextField
              required
              label="Task title"
              fullWidth
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.title && Boolean(errors.title)}
              helperText={touched.title && errors.title}
              sx={{ mb: 2 }}
            />

            <TextField
              required
              label="Task description"
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
          </form>
        </ContainedDialog>
      )}
    </Formik>
  );
}
