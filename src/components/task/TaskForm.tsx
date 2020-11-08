import { RightCircleTwoTone } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, DatePicker, Form, List, Select } from "antd";
import { FormikProps } from "formik";
import moment from "moment";
import React from "react";
import { ArrowLeft } from "react-feather";
import {
    IBlock,
    IBlockAssignedLabel,
    IBlockLabel,
    IBlockStatus,
    IBoardTaskResolution,
    ISubTask,
    ITaskAssignee,
    ITaskSprint,
} from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { IUser } from "../../models/user/user";
import { getDateString, indexArray } from "../../utils/utils";
import BlockParentSelection from "../block/BlockParentSelection";
import blockValidationSchemas from "../block/validation";
import BoardStatusResolutionAndLabelsForm, {
    BoardStatusResolutionAndLabelsFormType,
} from "../board/BoardStatusResolutionAndLabelsForm";
import CollaboratorThumbnail from "../collaborator/CollaboratorThumbnail";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import {
    formContentWrapperStyle,
    formInputContentWrapperStyle,
    StyledForm,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import SprintFormInDrawer from "../sprint/SprintFormInDrawer";
import StyledContainer from "../styled/Container";
import InputWithControls from "../utilities/InputWithControls";
import EditPriority from "./EditPriority";
import { TaskPriority } from "./Priority";
import SelectTaskSprint from "./SelectTaskSprint";
import SubTaskList from "./SubTaskList";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";
import TaskLabels from "./TaskLabels";
import TaskStatus from "./TaskStatus";

export interface ITaskFormValues extends Partial<IBlock> {}

type TaskFormFormikProps = FormikProps<ITaskFormValues>;
export type TaskFormErrors = IFormikFormErrors<ITaskFormValues>;

export interface ITaskFormProps {
    user: IUser;
    collaborators: IUser[];
    statusList: IBlockStatus[];
    resolutionsList: IBoardTaskResolution[];
    labelList: IBlockLabel[];
    possibleParents: IBlock[];
    value: ITaskFormValues;
    board: IBlock;
    sprints: ISprint[];
    sprintsMap: { [key: string]: ISprint };
    onClose: () => void;
    onSubmit: (values: ITaskFormValues) => void;
    onChangeParent: (parentId: string) => void;

    task?: IBlock;
    isSubmitting?: boolean;
    errors?: TaskFormErrors;
}

const StyledContainerAsLink = StyledContainer.withComponent("a");

const TaskForm: React.FC<ITaskFormProps> = (props) => {
    const {
        task,
        isSubmitting,
        possibleParents,
        value,
        collaborators,
        statusList,
        labelList,
        resolutionsList,
        user,
        board,
        sprints,
        sprintsMap,
        onClose,
        onSubmit,
        errors: externalErrors,
    } = props;

    const [
        subFormType,
        setSubFormType,
    ] = React.useState<BoardStatusResolutionAndLabelsFormType | null>(null);

    const [showSprintForm, setShowSprintForm] = React.useState<boolean>(false);

    const toggleShowSprintForm = React.useCallback(() => {
        setShowSprintForm(!showSprintForm);
    }, [showSprintForm]);

    const closeForm = React.useCallback(() => setSubFormType(null), []);

    const [indexedCollaborators] = React.useState(
        indexArray(props.collaborators, {
            path: "customId",
        })
    );

    const {
        formik,
        formikHelpers,
        formikChangedFieldsHelpers,
    } = useFormHelpers({
        errors: externalErrors,
        formikProps: {
            // TODO: show a message on form submit or close the form
            onSubmit,
            initialValues: value,
            validationSchema: !task
                ? blockValidationSchemas.newTask
                : blockValidationSchemas.updateTask,
        },
    });

    const status = formik.values.status;

    React.useEffect(() => {
        if (!status && statusList.length > 0) {
            formik.setValues({
                ...formik.values,
                status: statusList[0].customId,
                statusAssignedAt: getDateString(),
                statusAssignedBy: user.customId,
            });
        }
    }, [statusList, status, formik, user.customId]);

    const onChangeParent = (parentId: string) => {
        if (parentId === formik.values.parent) {
            return;
        }

        if (parentId === task?.parent) {
            formik.setValues({
                ...formik.values,
                parent: parentId,
                labels: task.labels,
                status: task.status,
                statusAssignedAt: task.statusAssignedAt,
                statusAssignedBy: task.statusAssignedBy,
            });

            return;
        } else {
            formik.setValues({
                ...formik.values,
                parent: parentId,
                labels: [],
                status: undefined,
                statusAssignedAt: undefined,
                statusAssignedBy: undefined,
            });
        }

        formikChangedFieldsHelpers.pushFields([
            "parent",
            "labels",
            "status",
            "statusAssignedAt",
            "statusAssignedBy",
        ]);
    };

    const renderParentInput = (formikProps: TaskFormFormikProps) => {
        const { touched, errors, values } = formikProps;

        return (
            <Form.Item
                label="Board"
                help={touched.parent && <FormError error={errors.parent} />}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <BlockParentSelection
                    value={values.parent}
                    possibleParents={possibleParents}
                    onChange={(val) => onChangeParent(val)}
                    disabled={isSubmitting}
                    placeholder="Select board"
                />
            </Form.Item>
        );
    };

    const renderNameInput = () => {
        const { touched, values, errors } = formik;

        return (
            <Form.Item
                label="Task"
                help={touched.name && <FormError error={errors.name} />}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <InputWithControls
                    useTextArea
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    value={values.name}
                    onChange={(val) => {
                        formik.setFieldValue("name", val);
                        formikChangedFieldsHelpers.addField("name");
                    }}
                    revertChanges={() => {
                        formikHelpers.revertChanges("name");
                    }}
                    autoComplete="off"
                    disabled={isSubmitting}
                    noEditable={!task}
                    placeholder="Task"
                />
            </Form.Item>
        );
    };

    const renderDescriptionInput = (formikProps: TaskFormFormikProps) => {
        const { touched, values, errors } = formikProps;

        return (
            <Form.Item
                label="Description"
                help={
                    touched.description && (
                        <FormError error={errors.description} />
                    )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <InputWithControls
                    useTextArea
                    value={values.description}
                    onChange={(val) => {
                        formik.setFieldValue("description", val);
                        formikChangedFieldsHelpers.addField("description");
                    }}
                    revertChanges={() => {
                        formikHelpers.revertChanges("description");
                    }}
                    autoComplete="off"
                    disabled={isSubmitting}
                    noEditable={!task}
                    placeholder="Description"
                    paragraphProps={{ type: "secondary" }}
                />
            </Form.Item>
        );
    };

    const renderPriority = (formikProps: TaskFormFormikProps) => {
        const { setFieldValue, values } = formikProps;

        return (
            <Form.Item
                label="Priority"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                labelAlign="left"
            >
                <EditPriority
                    onChange={(val: string) => {
                        setFieldValue("priority", val);
                        formikChangedFieldsHelpers.addField("priority");
                    }}
                    value={values.priority as TaskPriority}
                    disabled={isSubmitting}
                />
            </Form.Item>
        );
    };

    const renderSprintInput = () => {
        if (!board.sprintOptions) {
            return null;
        }

        const input = (
            <SelectTaskSprint
                sprints={sprints}
                sprintsMap={sprintsMap}
                task={formik.values as IBlock}
                disabled={isSubmitting}
                onAddNewSprint={toggleShowSprintForm}
                onChangeSprint={(val) => {
                    if (val === BACKLOG) {
                        formik.setFieldValue("taskSprint", null);
                    } else {
                        formik.setFieldValue("taskSprint", {
                            sprintId: val,
                            assignedAt: getDateString(),
                            assignedBy: user.customId,
                        } as ITaskSprint);
                    }
                    formikChangedFieldsHelpers.addField("taskSprint");
                }}
            />
        );

        return (
            <Form.Item
                label="Sprint"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                labelAlign="left"
            >
                {input}
            </Form.Item>
        );
    };

    const onChangeStatus = React.useCallback(
        async (val: string) => {
            if (val === task?.status) {
                formik.setValues({
                    ...formik.values,
                    status: task.status,
                    statusAssignedAt: task.statusAssignedAt,
                    statusAssignedBy: task.statusAssignedBy,
                });
            } else {
                formik.setValues({
                    ...formik.values,
                    status: val,
                    statusAssignedAt: getDateString(),
                    statusAssignedBy: user.customId,
                });
            }

            formikChangedFieldsHelpers.pushFields([
                "status",
                "statusAssignedAt",
                "statusAssignedBy",
            ]);

            return true;
        },
        [formik, formikChangedFieldsHelpers, task, user.customId]
    );

    const onChangeResolution = React.useCallback(
        (val: string) => {
            formik.setValues({
                ...formik.values,
                taskResolution: val,
            });

            formikChangedFieldsHelpers.pushFields(["taskResolution"]);
        },
        [formik, formikChangedFieldsHelpers]
    );

    const onSelectAddNewStatus = React.useCallback(() => {
        setSubFormType(BoardStatusResolutionAndLabelsFormType.STATUS);
    }, []);

    const onSelectAddNewResolution = React.useCallback(() => {
        setSubFormType(BoardStatusResolutionAndLabelsFormType.RESOLUTIONS);
    }, []);

    const renderStatus = (formikProps: TaskFormFormikProps) => {
        const { values } = formikProps;

        return (
            <Form.Item
                label="Status"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                labelAlign="left"
            >
                <TaskStatus
                    noResolutionModal
                    statusList={statusList}
                    resolutionsList={resolutionsList}
                    onChangeStatus={onChangeStatus}
                    onChangeResolution={onChangeResolution}
                    task={values as IBlock}
                    disabled={isSubmitting}
                    onSelectAddNewStatus={onSelectAddNewStatus}
                    onSelectAddNewResolution={onSelectAddNewResolution}
                />
            </Form.Item>
        );
    };

    const onChangeTaskLabels = React.useCallback(
        (val: IBlockAssignedLabel[]) => {
            formik.setFieldValue("labels", val);
            formikChangedFieldsHelpers.addField("labels");
        },
        [formik, formikChangedFieldsHelpers]
    );

    const onSelectAddNewLabel = React.useCallback(() => {
        setSubFormType(BoardStatusResolutionAndLabelsFormType.LABELS);
    }, []);

    // TODO: extract these fields into separate components with React.memo for speed
    const renderLabels = (formikProps: TaskFormFormikProps) => {
        const { values } = formikProps;

        return (
            <Form.Item
                label="Labels"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                labelAlign="left"
            >
                <TaskLabels
                    labelList={labelList}
                    user={user}
                    onChange={onChangeTaskLabels}
                    labels={values.labels}
                    disabled={isSubmitting}
                    onSelectAddNewLabel={onSelectAddNewLabel}
                />
            </Form.Item>
        );
    };

    const renderDueDateInput = (formikProps: TaskFormFormikProps) => {
        const { values, setFieldValue } = formikProps;

        return (
            <Form.Item
                label="Due Date"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                labelAlign="left"
            >
                <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Due date"
                    onChange={(val) => {
                        setFieldValue(
                            "dueAt",
                            val
                                ? val.hour(23).minute(59).second(0).valueOf()
                                : null
                        );
                        formikChangedFieldsHelpers.addField("dueAt");
                    }}
                    value={values.dueAt ? moment(values.dueAt) : undefined}
                    style={{ width: "100%" }}
                    disabled={isSubmitting}
                />
            </Form.Item>
        );
    };

    const unassignCollaborator = (
        collaboratorData: ITaskAssignee,
        assignees: ITaskAssignee[] = []
    ) => {
        const index = assignees.findIndex((next) => {
            return next.userId === collaboratorData.userId;
        });

        if (index !== -1) {
            const updated = [...assignees];
            updated.splice(index, 1);
            return updated;
        }

        return assignees;
    };

    const assignCollaborator = (
        collaborator: IUser,
        assignees: ITaskAssignee[] = []
    ): ITaskAssignee[] => {
        const collaboratorExists = !!assignees.find((next) => {
            return collaborator.customId === next.userId;
        });
        const existsBefore = (task?.assignees || []).find((next) => {
            return collaborator.customId === next.userId;
        });

        if (!collaboratorExists) {
            const assignedAt = existsBefore
                ? existsBefore.assignedAt
                : getDateString();
            const assignedBy = existsBefore
                ? existsBefore.assignedBy
                : user.customId;
            return [
                ...assignees,
                {
                    assignedAt,
                    assignedBy,
                    userId: collaborator.customId,
                },
            ];
        }

        return assignees;
    };

    const renderAssignees = (formikProps: TaskFormFormikProps) => {
        const { values, setFieldValue } = formikProps;

        if (!Array.isArray(values.assignees)) {
            return null;
        }

        if (values.assignees.length === 0) {
            return "Not assigned to anybody yet";
        }

        return (
            <List
                dataSource={values.assignees}
                renderItem={(item) => (
                    <List.Item>
                        <TaskCollaboratorThumbnail
                            key={item.userId}
                            collaborator={indexedCollaborators[item.userId]}
                            onUnassign={() => {
                                setFieldValue(
                                    "assignees",
                                    unassignCollaborator(item, values.assignees)
                                );

                                formikChangedFieldsHelpers.addField(
                                    "assignees"
                                );
                            }}
                            disabled={isSubmitting}
                        />
                    </List.Item>
                )}
            />
        );
    };

    const renderAssignedToInput = (formikProps: TaskFormFormikProps) => {
        const { setFieldValue, values } = formikProps;

        return (
            <Form.Item
                label="Assigned To"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Select
                    placeholder="Select collaborator"
                    value={undefined}
                    onChange={(index) => {
                        setFieldValue(
                            "assignees",
                            assignCollaborator(
                                collaborators[Number(index)],
                                values.assignees
                            )
                        );
                        formikChangedFieldsHelpers.addField("assignees");
                    }}
                    disabled={isSubmitting}
                    optionLabelProp="label"
                >
                    {collaborators.map((collaborator, index) => {
                        return (
                            <Select.Option
                                value={index}
                                key={collaborator.customId}
                                label={collaborator.name}
                            >
                                <CollaboratorThumbnail
                                    collaborator={collaborator}
                                />
                            </Select.Option>
                        );
                    })}
                </Select>
                <StyledContainerAsLink
                    role="button"
                    onClick={() => {
                        if (!isSubmitting) {
                            setFieldValue(
                                "assignees",
                                assignCollaborator(user, values.assignees)
                            );
                            formikChangedFieldsHelpers.addField("assignees");
                        }
                    }}
                    s={{
                        display: "block",
                        lineHeight: "32px",
                        cursor: isSubmitting ? "not-allowed" : undefined,
                        color: isSubmitting ? "#f0f0f0" : undefined,
                    }}
                >
                    <RightCircleTwoTone /> Assign To Me
                </StyledContainerAsLink>
                <StyledTaskCollaboaratorsContainer>
                    {renderAssignees(formikProps)}
                </StyledTaskCollaboaratorsContainer>
            </Form.Item>
        );
    };

    const onChangeSubTasks = (
        subTasks: ISubTask[],
        formikProps: TaskFormFormikProps
    ) => {
        const { values, setValues } = formikProps;
        const update: ITaskFormValues = { ...values, subTasks };
        setValues(update);
        formikChangedFieldsHelpers.addField("subTasks");
    };

    const onDiscardSubTaskChanges = (index: number) => {
        const taskInitialValue = formik.initialValues || {};
        const initialSubTasks = taskInitialValue.subTasks || [];
        const initialValue = initialSubTasks[index];

        if (initialValue) {
            formik.setFieldValue(`subTasks.[${index}]`, initialValue);
            formikChangedFieldsHelpers.addField("subTasks");
        }
    };

    const renderSubTasks = (formikProps: TaskFormFormikProps) => {
        const { values, touched, errors } = formikProps;

        return (
            <StyledContainer
                s={{
                    flexDirection: "column",
                    width: "100%",
                    marginBottom: "24px",
                }}
            >
                <SubTaskList
                    user={user}
                    subTasks={values.subTasks || []}
                    errors={errors.subTasks as any}
                    touched={touched.subTasks as any}
                    onChange={(subTasks) =>
                        onChangeSubTasks(subTasks, formikProps)
                    }
                    disabled={isSubmitting}
                    onAddSubTask={(subTask) => {
                        formikHelpers.addToArrayField(
                            "subTasks",
                            subTask,
                            {},
                            {},
                            value.subTasks?.length
                        );
                        formikChangedFieldsHelpers.addField("subTasks");
                    }}
                    onDeleteSubTask={(index) => {
                        formikHelpers.deleteInArrayField("subTasks", index);
                    }}
                    onDiscardSubTaskChanges={onDiscardSubTaskChanges}
                />
            </StyledContainer>
        );
    };

    const getSubmitLabel = () => {
        if (isSubmitting) {
            if (task) {
                return "Saving Changes";
            } else {
                return "Creating Task";
            }
        } else {
            if (task) {
                return "Save Changes";
            } else {
                return "Create Task";
            }
        }
    };

    const renderControls = () => {
        return (
            <StyledContainer>
                <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    disabled={!formikChangedFieldsHelpers.hasChanges()}
                >
                    {getSubmitLabel()}
                </Button>
            </StyledContainer>
        );
    };

    const renderForm = (formikProps: TaskFormFormikProps) => {
        const { handleSubmit, errors } = formikProps;
        const globalError = getFormError(errors);

        return (
            <StyledForm onSubmit={handleSubmit}>
                {subFormType && (
                    <BoardStatusResolutionAndLabelsForm
                        visible
                        block={board}
                        onClose={closeForm}
                        active={subFormType}
                    />
                )}
                {showSprintForm && (
                    <SprintFormInDrawer
                        visible
                        board={board}
                        onClose={toggleShowSprintForm}
                    />
                )}
                <StyledContainer s={formContentWrapperStyle}>
                    <StyledContainer s={formInputContentWrapperStyle}>
                        <StyledContainer s={{ paddingBottom: "16px" }}>
                            <Button
                                style={{ cursor: "pointer" }}
                                onClick={onClose}
                                className="icon-btn"
                            >
                                <ArrowLeft />
                            </Button>
                        </StyledContainer>
                        {globalError && (
                            <Form.Item>
                                <FormError error={globalError} />
                            </Form.Item>
                        )}
                        {renderNameInput()}
                        {renderDescriptionInput(formikProps)}
                        {renderParentInput(formikProps)}
                        {renderPriority(formikProps)}
                        {renderSprintInput()}
                        {renderStatus(formikProps)}
                        {renderLabels(formikProps)}
                        {renderDueDateInput(formikProps)}
                        {renderAssignedToInput(formikProps)}
                        {renderSubTasks(formikProps)}
                    </StyledContainer>
                    {renderControls()}
                </StyledContainer>
            </StyledForm>
        );
    };

    return renderForm(formik);
};

const StyledTaskCollaboaratorsContainer = styled.div({
    marginBottom: 16,
});

export default React.memo(TaskForm);

const BACKLOG = "Backlog";
