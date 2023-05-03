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

type Title = ModalProps["title"];

interface withModalRef<InitialValue> {
  open: (openProps: {
    title: Title;
    initialValue?: Partial<InitialValue>;
    mode?: FormMode;
    record?: PlainObject;
  }) => void;
}
interface ModalPlusProps extends Partial<Omit<ModalProps, "title" | "onOk">> {
  onError?: (e: Error) => void;
  onSuccess?: ModalProps["onOk"];
}

export const useModalRef = <InitialValue extends PlainObject>() => {
  return useRef<withModalRef<InitialValue>>(null);
};

export const withModal = <FormVal extends PlainObject>(params?: {
  submit?: (params: {
    mode: FormMode;
    data: FormVal;
    record: PlainObject;
  }) => Promise<void | "success">;
}) => {
  const { submit } = params ?? {};

  return (
    FormComponent: React.ComponentType<{
      form: FormInstance;
      mode: FormMode;
      data: Partial<FormVal>;
    }>
  ) => {
    const ModalPlus = forwardRef<withModalRef<FormVal>, ModalPlusProps>(
      (props, ref) => {
        const {
          cancelText,
          okText,
          onCancel,
          open = false,
          destroyOnClose = true,
          onError,
          onSuccess,
          ...nestProps
        } = props ?? {};
        const [title, setTitle] = useState<Title>();
        const [mode, setMode] = useState<FormMode>(FormMode.Add);
        const [value, setValue] = useState<Partial<FormVal>>({});
        const [record, setRecord] = useState<PlainObject>({});
        const confirmLoading = useBoolean();
        const visible = useBoolean(open);
        const [form] = Form.useForm();

        const readOnly = useMemo(() => {
          return mode === "view";
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
              form.resetFields()
              visible.setFalse();
            }}
            okButtonProps={{
              style: { display: readOnly ? "none" : "inline-block" },
            }}
            cancelButtonProps={{ type: readOnly ? "primary" : "default" }}
            onOk={async (e) => {
              confirmLoading.setTrue();
              const { errorFields } = await form
                .validateFields()
                .catch(identity);
              if (errorFields) {
                confirmLoading.setFalse();
                return;
              }
              submit?.({ mode, data: form.getFieldsValue(), record })
                .then((status) => {
                  if (status === "success") {
                    visible.setFalse();
                    onSuccess?.(e);
                  }
                })
                .catch((e) => {
                  if (onError) {
                    onError?.(e);
                  } else {
                    throw new Error(e);
                  }
                })
                .finally(() => {
                  confirmLoading.setFalse();
                });
            }}
            destroyOnClose={destroyOnClose}
            confirmLoading={confirmLoading.state}
            cancelText={cancelText}
            {...nestProps}
          >
            <FormComponent form={form} mode={mode} data={value} />
          </Modal>
        );
      }
    );

    ModalPlus.displayName = `withModal(${getDisplayName(FormComponent)})`;

    return ModalPlus;
  };
};
