import React from "react";
import { useHistory } from "react-router";
import { IBlock } from "../../models/block/block";
import CollaborationRequests from "../collaborator/CollaborationRequests";
import CollaboratorList from "../collaborator/CollaboratorList";
import GroupList from "../group/GL";
import { concatPaths } from "../layout/path";
import ProjectList from "../project/PL";
import TaskList from "../task/TL";
import BoardBaskets, { IBoardBasket } from "./BoardBaskets";
import BoardBlockChildrenRoutes from "./BoardBlockChildrenRoutes";
import BoardBlockChildren from "./BoardChildren";
import BoardLandingMenu from "./BoardLandingMenu";
import Column from "./C";

export interface IBoardBodyMobileProps {
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;
}

const BoardBodyMobile: React.FC<IBoardBodyMobileProps> = props => {
  const { block, onClickUpdateBlock } = props;
  const history = useHistory();

  const onClickChild = (childBlock: IBlock) => {
    const path = concatPaths(window.location.pathname, childBlock.customId);
    history.push(path);
  };

  const renderChildrenGroup = (
    blocks: IBlock[],
    emptyMessage: string,
    renderBasketFunc: (basket: IBoardBasket) => React.ReactNode
  ) => {
    return (
      <BoardBaskets
        blocks={blocks}
        emptyMessage={emptyMessage}
        getBaskets={() =>
          blocks.length > 0 ? [{ key: "blocks", blocks }] : []
        }
        renderBasket={basket => <Column body={renderBasketFunc(basket)} />}
      />
    );
  };

  const renderTasks = () => {
    return (
      <BoardBlockChildren
        parent={block}
        getChildrenIDs={() => block.tasks || []}
        render={tasks =>
          renderChildrenGroup(tasks, "No tasks yet.", () => (
            <TaskList
              tasks={tasks}
              toggleForm={task => onClickUpdateBlock(task)}
            />
          ))
        }
      />
    );
  };

  const renderProjects = () => {
    return (
      <BoardBlockChildren
        parent={block}
        getChildrenIDs={() => block.projects || []}
        render={projects =>
          renderChildrenGroup(projects, "No projects yet.", () => (
            <ProjectList projects={projects} onClick={onClickChild} />
          ))
        }
      />
    );
  };

  const renderGroups = () => {
    return (
      <BoardBlockChildren
        parent={block}
        getChildrenIDs={() => block.groups || []}
        render={groups =>
          renderChildrenGroup(groups, "No groups yet.", () => (
            <GroupList groups={groups} onClick={onClickChild} />
          ))
        }
      />
    );
  };

  const renderCollaborators = () => {
    return <CollaboratorList organization={block} />;
  };

  const renderCollaborationRequests = () => {
    return <CollaborationRequests organization={block} />;
  };

  const renderLandingMenu = () => (
    <BoardLandingMenu
      block={block}
      onClick={key => {
        history.push(concatPaths(window.location.pathname, key));
      }}
    />
  );

  return null;
  // <BoardBlockChildrenRoutes
  //   block={block}
  //   renderCollaborationRequests={renderCollaborationRequests}
  //   renderCollaborators={renderCollaborators}
  //   renderGroups={renderGroups}
  //   renderLandingMenu={renderLandingMenu}
  //   renderProjects={renderProjects}
  //   renderTasks={renderTasks}
  // />
};

export default BoardBodyMobile;
