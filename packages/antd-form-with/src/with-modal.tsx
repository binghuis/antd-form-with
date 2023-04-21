import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Modal, ModalProps, Form, FormInstance } from "antd";
import { identity, isEmpty } from "lodash-es";
import useBoolean from "./hooks/use-boolean";
import { FormMode, PlainObject } from "./types";
import { getDisplayName } from "./util";

export const useModalRef = <InitialValue extends PlainObject>() => {
  return useRef<withModalRef<InitialValue>>(null);
};

type Title = ModalProps["title"];

interface withModalRef<InitialValue> {
  open: (openProps: {
    title: Title;
    initialValue?: Partial<InitialValue>;
    mode?: FormMode;
    record?: PlainObject;
  }) => void;
}

export const withModal = <FormVal extends PlainObject>(
  props?: Partial<Omit<ModalProps, "title">> & {
    submit?: (params: {
      mode: FormMode;
      data: FormVal;
      record: PlainObject;
    }) => Promise<void>;
    onError?: Function;
  }
) => {
  const {
    cancelText,
    okText,
    onError,
    onOk,
    onCancel,
    destroyOnClose = true,
    submit,
    ...nestProps
  } = props ?? {};

  return (
    FormComponent: React.ComponentType<{
      form: FormInstance;
      mode: FormMode;
      data: Partial<FormVal>;
    }>
  ) => {
    const WrappedFormComponent = forwardRef<withModalRef<FormVal>>((_, ref) => {
      const [title, setTitle] = useState<Title>();
      const [mode, setMode] = useState<FormMode>(FormMode.View);
      const [value, setValue] = useState<Partial<FormVal>>();
      const [record, setRecord] = useState<PlainObject>({});
      const confirmLoading = useBoolean();
      const visible = useBoolean();
      const [form] = Form.useForm();

      const readOnly = useMemo(() => {
        return mode === FormMode.View;
      }, [mode]);

      useImperativeHandle(ref, () => ({
        open: (openProps) => {
          const { title, initialValue, mode, record = {} } = openProps;
          if (!isEmpty(initialValue)) {
            setValue(initialValue);
            form.setFieldsValue(initialValue);
          }
          setRecord(record);
          if (mode) {
            setMode(mode);
          }
          setTitle(title);
          visible.setTrue();
        },
      }));

      return (
        <Modal
          title={title}
          open={visible.state}
          okText={okText}
          onCancel={(e) => {
            onCancel?.(e);
            visible.setFalse();
          }}
          okButtonProps={{
            style: { display: readOnly ? "none" : "inline-block" },
          }}
          cancelButtonProps={{ type: readOnly ? "primary" : "default" }}
          onOk={async (e) => {
            confirmLoading.setTrue();
            const { errorFields } = await form.validateFields().catch(identity);
            if (errorFields) {
              confirmLoading.setFalse();
              return;
            }
            submit?.({ mode, data: form.getFieldsValue(), record })
              .then(() => {
                confirmLoading.setFalse();
                onOk?.(e);
              })
              .catch(() => {
                onError?.();
              });
          }}
          destroyOnClose={destroyOnClose}
          confirmLoading={confirmLoading.state}
          cancelText={cancelText}
          {...nestProps}
        >
          <FormComponent form={form} mode={mode} data={value ?? {}} />
        </Modal>
      );
    });

    WrappedFormComponent.displayName = `withModal(${getDisplayName(
      FormComponent
    )})`;

    return WrappedFormComponent;
  };
};
