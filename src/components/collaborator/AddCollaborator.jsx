import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Button, Form } from "antd";
import modalWrap from "../modalWrap.jsx";
import CollaboratorForm from "./AddCollaboratorForm.jsx";
import moment from "moment";

class AddCollaborator extends React.Component {
  static defaultProps = {
    data: {}
  };

  formRef = React.createRef();

  constructor(props) {
    super(props);
    const self = this;

    this.model = {
      fields: {
        collaborators: {
          render(form) {
            return (
              <div key="add-collaborator">
                <p>
                  If request expiration date is not provided, the default
                  expiration duration is 1 month.
                </p>
                <Form.Item>
                  <CollaboratorForm
                    ref={self.formRef}
                    form={form}
                    existingCollaborators={props.existingCollaborators}
                    existingCollaborationRequests={
                      props.existingCollaborationRequests
                    }
                  />
                </Form.Item>
              </div>
            );
          }
        },
        submit: {
          component: Button,
          props: {
            type: "primary",
            children: "Submit",
            block: true,
            htmlType: "submit"
          },
          labelCol: null,
          wrapperCol: null,
          noDecorate: true
        }
      },
      formProps: {
        hideRequiredMark: true
      },
      onSubmit: self.onSubmit
    };
  }

  onSubmit = async submittedData => {
    if (this.formRef.current) {
      let success = await this.formRef.current.validate();

      if (success) {
        submittedData.message = null;
        submittedData.expiresAt = moment()
          .add(1, "months")
          .valueOf();

        this.props.onSubmit(submittedData);
      }
    }
  };

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

export default modalWrap(
  Form.create()(AddCollaborator),
  "Collaboration Request"
);
