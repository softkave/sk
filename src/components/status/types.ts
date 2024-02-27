import { FormikProps } from "formik";
import { IBoardStatus } from "../../models/board/types";

export type StatusListFormikProps = FormikProps<{ statusList: IBoardStatus[] }>;
export type StatusListFormikErrors = StatusListFormikProps["errors"];
