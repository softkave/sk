import React, { Component } from 'react';
import { AppNewTaskForm } from './NewTaskForm';
import { Drawer, Form } from 'antd';
import {ComponentForm} from '../../common/Form';

class AppNewTaskBase extends Component {
  onSubmit = async (task) => {
    const { data, onSubmit } = this.props;
    task.data = [{dataType: "priority", data: task.priority}];
    delete task.priority;
    
    if (task.expectedEndAt) {
      task.expectedEndAt = task.expectedEndAt.valueOf();
    }

    this.submitting = true;
    await onSubmit(task, data);
    this.submitting = false;
    //this.onClose();
  }

  onClose = () => {
    if (!this.submitting) {
      this.props.onCancel();
    }
  }

  render() {
    const { visible } = this.props;
    return (
      <Drawer 
        visible={visible}
        onClose={this.onClose}
        destroyOnClose
        width={320}
      >
        <ComponentForm 
          {...this.props}
          component={AppNewTaskForm}
          onSubmit={this.onSubmit}
        />
      </Drawer>
    );
  }
}

export const AppNewTask = Form.create()(AppNewTaskBase);