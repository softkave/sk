import styled from "@emotion/styled";
import React from "react";

export interface ISplit {
  id: string | number;
  flex: string | number;
  render: () => React.ReactNode;
  title?: string;
  onClose?: () => void;
}

export interface ISplitViewProps {
  splits?: ISplit[];
}

export default class SplitView extends React.Component<ISplitViewProps> {
  public static defaultProps = {
    splits: []
  };

  public render() {
    const { splits } = this.props;

    return (
      <SplitContainer>
        {splits!.map(split => {
          return this.renderSplit(split);
        })}
      </SplitContainer>
    );
  }

  private renderSplit(split: ISplit) {
    return (
      <ViewContainer key={split.id} flex={split.flex}>
        {split.render()}
      </ViewContainer>
    );
  }
}

const SplitContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

interface IViewContainerProps {
  flex: string | number;
}

const ViewContainer = styled("div")<IViewContainerProps>(props => {
  return {
    display: "flex",
    flex: props.flex,
    flexDirection: "column",
    height: "100%",
    overflow: "hidden"
  };
});
