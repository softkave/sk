import * as yup from "yup";
import { AnyObject } from "./types";

export function yupObject<T extends AnyObject | undefined>(
  s: Record<keyof NonNullable<T>, yup.AnySchema>
) {
  return yup.object(s);
}
