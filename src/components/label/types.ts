import { FormikProps } from "formik";
import { IBoardLabel } from "../../models/board/types";

export type LabelListFormikProps = FormikProps<{ labelList: IBoardLabel[] }>;
export type LabelListFormikErrors = LabelListFormikProps["errors"];
