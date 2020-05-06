import { FormikProps } from "formik";
import { IBlockStatus } from "../../models/block/block";

export type StatusListFormikProps = FormikProps<{ statusList: IBlockStatus[] }>;
export type StatusListFormikErrors = StatusListFormikProps["errors"];
