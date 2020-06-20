import { CSSObject } from "@emotion/styled";

export interface IStyleObject {
  [key: string]: CSSObject | IStyleObject;
}
