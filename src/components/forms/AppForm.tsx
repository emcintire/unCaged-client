import { Formik } from 'formik';
import type { FormikValues, FormikHelpers } from 'formik';
import type { ReactNode } from 'react';
import type { AnySchema } from 'yup';

type Props<Values extends FormikValues> = {
  initialValues: Values;
  onSubmit: (values: Values, formikHelpers: FormikHelpers<Values>) => void;
  validationSchema?: AnySchema;
  children: ReactNode;
};

export default function AppForm<Values extends FormikValues>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}: Props<Values>) {
  return (
    <Formik<Values>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {() => <>{children}</>}
    </Formik>
  );
}
