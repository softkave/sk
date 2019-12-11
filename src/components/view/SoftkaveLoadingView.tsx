import React from "react";

import SoftkaveLoadingText from "../SoftkaveLoadingText";
import ViewShell from "./ViewShell";

export interface ISoftkaveLoadingViewProps {
  percent?: number;
}

const SoftkaveLoadingView: React.FC<ISoftkaveLoadingViewProps> = props => {
  return (
    <ViewShell>
      <SoftkaveLoadingText percent={props.percent!} />
    </ViewShell>
  );
};

SoftkaveLoadingView.defaultProps = {
  percent: 100
};

export default SoftkaveLoadingView;
