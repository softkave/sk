import React from "react";
import ComputeForm from "../../compute-form/ComputeForm.jsx";
import { Input, Button, Form } from "antd";
import { orgDescriptor as blockDescriptor } from "../../../models/block/descriptor";
import { makeNameExistsValidator } from "../../../utils/descriptor";
import modalWrap from "../../modalWrap.jsx";
import FormError from "../../FormError.jsx";
import { constructSubmitHandler } from "../../form-utils.js";

const orgExistsErrorMessage = "Organization with the same name exists";

class EditOrg extends React.Component {
  static defaultProps = {
    data: {},
    submitLabel: "Create Organization"
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: null
    };

    // const self = this;
    // const data = props.data || {};

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
    //             props.existingOrgs,
    //             "orgs exist"
    //           )
    //         }
    //       ],
    //       initialValue: data.name
    //     },
    //     description: {
    //       component: TextArea,
    //       props: { autosize: { minRows: 2, maxRows: 6 } },
    //       label: "Description",
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
  //   data.type = "org";
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
        data.type = "org";
        return data;
      },
      beforeProcess: () => this.setState({ isLoading: true }),
      afterErrorProcess: indexedErrors => {
        if (indexedErrors.error) {
          this.setState({ error: indexedErrors.error });
        }
      },
      completedProcess: () => this.setState({ isLoading: false })
    });
  };

  render() {
    const { form, data, submitLabel, existingOrgs } = this.props;
    const { isLoading, error } = this.state;
    const onSubmit = this.getSubmitHandler();

    return (
      <Spin spinning={isLoading}>
        <Form hideRequiredMark onSubmit={onSubmit}>
          {error && <FormError>{error}</FormError>}
          <Form.Item label="Organization Name">
            {form.getFieldDecorator("name", {
              rules: [
                ...blockDescriptor.name,
                {
                  validator: makeNameExistsValidator(
                    existingOrgs,
                    orgExistsErrorMessage
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

export default modalWrap(Form.create()(EditOrg), "Org");
