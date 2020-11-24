import { CSSObject } from "@emotion/styled";
import { ReactText } from "react";

export type ComponentStyle = CSSObject | React.CSSProperties;

export interface IAntDMenuEvent<T = ReactText> {
    key: T;
}
