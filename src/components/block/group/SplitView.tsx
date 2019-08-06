import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";

export interface ISplit {
  flex: string | number;
  render: () => React.ReactNode;
  showControls?: boolean;
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
      <ViewContainer flex={split.flex}>
        {split.showControls && (
          <ViewHeader>
            <ViewTitle>{split.title}</ViewTitle>
            <CloseViewButtonContainer>
              <Button icon="close" onClick={split.onClose} type="danger" />
            </CloseViewButtonContainer>
          </ViewHeader>
        )}
        <ViewBodyContainer>{split.render()}</ViewBodyContainer>
      </ViewContainer>
    );
  }
}

const SplitContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

interface IViewContainerProps {
  flex: string | number;
}

const ViewContainer = styled("div")<IViewContainerProps>(props => {
  return {
    display: "flex",
    flex: props.flex,
    flexDirection: "column"
  };
});

const ViewHeader = styled.div`
  display: flex;
`;

const ViewTitle = styled.div`
  display: flex;
  flex: 1;
`;

const CloseViewButtonContainer = styled.div`
  display: flex;
`;

const ViewBodyContainer = styled.div`
  display: flex;
  flex: 1;
`;
