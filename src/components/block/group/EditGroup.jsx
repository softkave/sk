import React from "react";
import ComputeForm from "../../compute-form/ComputeForm.jsx";
import { Input, Button, Form, Spin } from "antd";
import { groupDescriptor as blockDescriptor } from "../../../models/block/descriptor";
import { makeNameExistsValidator } from "../../../utils/descriptor";
import modalWrap from "../../modalWrap.jsx";
import FormError from "../../FormError.jsx";
import { constructSubmitHandler } from "../../form-utils.js";

const groupExistsErrorMessage = "Group with the same name exists";

class EditGroup extends React.Component {
  static defaultProps = {
    data: {},
    submitLabel: "Create Group"
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: null
    };

    // const data = props.data || {};
    // const self = this;
    // this.model = {
    //   fields: {
    //     name: {
    //       component: Input,
    //       props: { autoComplete: "off" },
    //       label: "Name",
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: [
    //         ...blockDescriptor.name,
    //         {
    //           validator: makeNameExistsValidator(
    //             props.existingGroups,
    //             "group exists"
    //           )
    //         }
    //       ],
    //       initialValue: data.name
    //     },
    //     description: {
    //       component: TextArea,
    //       props: { autosize: { minRows: 2, maxRows: 6 } },
    //       label: "Description",
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: blockDescriptor.description,
    //       initialValue: data.description
    //     },
    //     submit: {
    //       component: Button,
    //       props: {
    //         type: "primary",
    //         children: "Submit",
    //         block: true,
    //         htmlType: "submit"
    //       },
    //       labelCol: null,
    //       wrapperCol: null,
    //       noDecorate: true
    //     }
    //   },
    //   formProps: {
    //     hideRequiredMark: true
    //   },
    //   onSubmit: self.onSubmit
    // };
  }

  // onSubmit = data => {
  //   data.type = "group";
  //   return this.props.onSubmit(data);
  // };

  // render() {
  //   return <ComputeForm model={this.model} form={this.props.form} />;
  // }

  getSubmitHandler = () => {
    const { form, onSubmit } = this.props;

    return constructSubmitHandler({
      form,
      submitCallback: onSubmit,
      proccess: data => {
        data.type = "group";
        return data;
      },
      beforeProcess: () => this.setState({ isLoading: true, error: null }),
      afterErrorProcess: indexedErrors => {
        if (Array.isArray(indexedErrors.error)) {
          this.setState({ error: indexedErrors.error[0].message });
        }
      },
      completedProcess: () => this.setState({ isLoading: false })
    });
  };

  render() {
    const { form, data, submitLabel, existingGroups } = this.props;
    const { isLoading, error } = this.state;
    const onSubmit = this.getSubmitHandler();

    return (
      <Spin spinning={isLoading}>
        <Form hideRequiredMark onSubmit={onSubmit}>
          {error && <FormError>{error}</FormError>}
          <Form.Item label="Group Name">
            {form.getFieldDecorator("name", {
              rules: [
                ...blockDescriptor.name,
                {
                  validator: makeNameExistsValidator(
                    existingGroups,
                    groupExistsErrorMessage
                  )
                }
              ],
              initialValue: data.name
            })(<Input autoComplete="off" />)}
          </Form.Item>
          <Form.Item label="Description">
            {form.getFieldDecorator("description", {
              rules: blockDescriptor.description,
              initialValue: data.description
            })(
              <Input.TextArea
                autosize={{ minRows: 2, maxRows: 6 }}
                autoComplete="off"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              {submitLabel}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

export default modalWrap(Form.create()(EditGroup), "Group");
