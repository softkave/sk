import { FormikProps } from "formik";
import { IBlockLabel } from "../../models/block/block";

export type LabelListFormikProps = FormikProps<{ labelList: IBlockLabel[] }>;
export type LabelListFormikErrors = LabelListFormikProps["errors"];
