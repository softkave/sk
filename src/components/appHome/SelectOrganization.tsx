import { CaretDownOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IAppOrganization } from "../../models/organization/types";
import OrganizationSelectors from "../../redux/organizations/selectors";
import { IAppState } from "../../redux/types";
import BlockThumbnail from "../block/BlockThumnail";
import SpaceOut, { ISpaceOutContent } from "../utilities/SpaceOut";

export interface ISelectOrganizationProps {
  className?: string;
  style?: React.CSSProperties;
  organizationId: string;
  onOpen: () => void;
}

const classes = {
  root: css({
    display: "flex",
    padding: "8px 16px",
    cursor: "pointer",
    borderBottom: "2px solid rgb(223, 234, 240)",
    flexDirection: "column",
    width: "100%",
  }),
};

const SelectOrganization: React.FC<ISelectOrganizationProps> = (props) => {
  const { organizationId, style, className, onOpen } = props;
  const organization = useSelector<IAppState, IAppOrganization>((state) =>
    OrganizationSelectors.assertGetOne(state, organizationId)
  );
  const spaceOutContent: ISpaceOutContent[] = React.useMemo(() => {
    const content: ISpaceOutContent[] = [
      {
        node: (
          <BlockThumbnail
            key={organization.customId}
            block={organization}
            showFields={["name"]}
          />
        ),
        style: { flex: 1 },
      },
      {
        node: (
          <Typography.Text type="secondary">
            <CaretDownOutlined />
          </Typography.Text>
        ),
      },
    ];

    return content;
  }, [organization]);

  return (
    <div className={cx(classes.root, className)} style={style} onClick={onOpen}>
      <SpaceOut size="middle" content={spaceOutContent} />
    </div>
  );
};

export default SelectOrganization;
