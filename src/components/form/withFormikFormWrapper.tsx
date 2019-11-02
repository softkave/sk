import { Formik, FormikConfig } from "formik";
import isFunction from "lodash/isFunction";
import React from "react";
import IOperation from "../../redux/operations/operation";
import cast from "../../utils/cast";
import { IAnyObject } from "../../utils/types";
import { newId } from "../../utils/utils";
import {
  getFormikFormStateFromOperation,
  IFormikFormBaseProps,
  setFormikFormStateFromProps,
  shouldCloseFormikForm
} from "./formik-utils";

export default function withFormikFormWrapper(
  options?: Omit<
    FormikConfig<any>,
    "component" | "render" | "children" | "onSubmit" | "initialValues"
  >
) {
  return function wrapComponent<
    ComponentType extends
      | React.FunctionComponent<IFormikFormBaseProps<any> & any>
      | React.ComponentClass<IFormikFormBaseProps<any> & any>
  >(component: ComponentType) {
    type ComponentProps = React.ComponentPropsWithRef<ComponentType>;
    type RemainingComponentProps = Omit<
      ComponentProps,
      keyof IFormikFormBaseProps<any>
    >;

    type Values = ComponentProps["values"];
    type FormikFormWrapperProps = RemainingComponentProps & {
      onSubmit: (values: Values) => Promise<void>;
      onClose: () => void;
      operation?: IOperation;
      getFormIdentifier?: () => string;
      initialValues?: Values;
    };

    type RefType = React.RefObject<ComponentType> | React.Ref<ComponentType>;

    interface IFormikFormWrapperState {
      scopeID?: string;
    }

    class FormikFormWrapper extends React.Component<
      FormikFormWrapperProps & { forwardedRef?: RefType },
      IFormikFormWrapperState
    > {
      private formikRef: React.RefObject<Formik<Values>> = React.createRef();

      public componentDidMount() {
        const scopeID = this.getScopeID();

        if (scopeID) {
          this.setState({ scopeID });
        }

        this.setFormikFormState();
      }

      public componentDidUpdate() {
        const { operation, onClose } = this.props;
        const { scopeID } = this.state;
        const formikBag = this.getFormikBag();

        if (formikBag) {
          if (
            !formikBag.isSubmitting &&
            shouldCloseFormikForm(operation, scopeID)
          ) {
            if (isFunction(onClose)) {
              onClose();
            }
          } else {
            this.setFormikFormState();
          }
        }
      }

      public render() {
        const {
          forwardedRef,
          operation,
          getFormIdentifier,
          onClose,
          onSubmit,
          ...rest
        } = this.props;

        return (
          <Formik
            {...options}
            ref={this.formikRef}
            initialValues={rest.initialValues}
            onSubmit={this.onSubmitForm}
          >
            {props =>
              React.createElement(component, {
                ...rest,
                ...cast<IFormikFormBaseProps<Values>>(props),
                ref: forwardedRef
              })
            }
          </Formik>
        );
      }

      private getFormikBag() {
        if (this.formikRef.current) {
          return this.formikRef.current.getFormikBag();
        }
      }

      private setFormikFormState() {
        const { operation } = this.props;
        const { scopeID } = this.state;
        const formikBag = this.getFormikBag();
        const state = getFormikFormStateFromOperation(operation, scopeID);

        if (formikBag) {
          setFormikFormStateFromProps(formikBag, state);
        }
      }

      private onSubmitForm(values: Values) {
        const { onSubmit } = this.props;

        onSubmit(values);
      }

      private getScopeID() {
        const { getFormIdentifier } = this.props;

        if (isFunction(getFormIdentifier)) {
          const formID = getFormIdentifier();
          const scopeID = `${formID}--${newId()}`;

          return scopeID;
        }
      }
    }

    const displayName = `withFormikFormWrapper(${component.displayName ||
      component.name ||
      "Component"})`;

    function forwardRef(props: FormikFormWrapperProps, ref: RefType) {
      return <FormikFormWrapper {...props} forwardedRef={ref} />;
    }

    cast<React.FunctionComponent>(FormikFormWrapper).displayName = displayName;
    forwardRef.displayName = displayName;
    return React.forwardRef(forwardRef);
  };
}
