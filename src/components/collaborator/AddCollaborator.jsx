import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Button, Form } from "antd";
import modalWrap from "../modalWrap.jsx";
import CollaboratorForm from "./CollaboratorForm.jsx";

let collaboratorsFormHelpers = null;

class AddCollaborator extends React.Component {
  static defaultProps = {
    data: {}
  };

  constructor(props) {
    super(props);
    const self = this;

    this.model = {
      fields: {
        collaborators: {
          render(form) {
            return (
              <Form.Item label="Collaborators" key="collaborators">
                <CollaboratorForm
                  form={form}
                  roles={props.roles}
                  getHelpers={helpers => {
                    collaboratorsFormHelpers = helpers;
                  }}
                  clearHelpers={() => {
                    collaboratorsFormHelpers = null;
                  }}
                />
              </Form.Item>
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

  onSubmit = submittedData => {
    if (collaboratorsFormHelpers) {
      collaboratorsFormHelpers.validate((error, success) => {
        if (!error) {
          this.props.onSubmit(submittedData.collaborators);
        }
      });
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
