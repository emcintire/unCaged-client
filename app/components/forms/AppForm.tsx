import { Formik } from 'formik';
import type { FormikValues, FormikHelpers } from 'formik';
import type { ReactNode } from 'react';
import type { AnySchema } from 'yup';

type Props<T extends FormikValues> = {
  initialValues: T;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
  validationSchema?: AnySchema;
  children: ReactNode;
};

export default function AppForm<T extends FormikValues>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}: Props<T>) {
  return (
    <Formik<T>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {() => <>{children}</>}
    </Formik>
  );
}
