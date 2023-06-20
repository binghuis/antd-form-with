import useBoolean from './hooks/use-boolean';
import { FormMode } from './types';
import { getDisplayName } from './util';
import { Form, FormInstance, Modal, ModalProps } from 'antd';
import { identity, isEmpty } from 'lodash-es';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

/** 组件 ref 类型 */
interface withModalRef<FormType, RecordType> {
  open: (openProps: {
    title: Title;
    initialValue?: Partial<FormType>;
    mode?: FormMode;
    record?: RecordType;
  }) => void;
}

export const useModalRef = <
  FormType extends object,
  RecordType extends object,
>() => {
  return useRef<withModalRef<FormType, RecordType>>(null);
};

type Title = ModalProps['title'];

interface ModalPlusProps extends Partial<Omit<ModalProps, 'title' | 'onOk'>> {
  onError?: (e: Error) => void;
  onSuccess?: ModalProps['onOk'];
}

export const withModal = <
  FormType extends object,
  RecordType extends object,
>(params?: {
  submit?: (params: {
    mode: FormMode;
    data?: FormType;
    record?: Partial<RecordType>;
  }) => Promise<void | 'success'>;
}) => {
  const { submit } = params ?? {};

  return (
    FormComponent: React.ComponentType<{
      form: FormInstance;
      mode: FormMode;
      data?: Partial<FormType>;
    }>,
  ) => {
    const ModalPlus = forwardRef<
      withModalRef<FormType, RecordType>,
      ModalPlusProps
    >((props, ref) => {
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
      const [value, setValue] = useState<Partial<FormType>>();
      const [record, setRecord] = useState<Partial<RecordType>>();
      const confirmLoading = useBoolean();
      const visible = useBoolean(open);
      const [form] = Form.useForm();

      const readOnly = useMemo(() => {
        return mode === 'view';
      }, [mode]);

      useEffect(() => {
        if (!isEmpty(value)) {
          form.setFieldsValue(value);
        }
      }, [value]);

      useImperativeHandle(ref, () => ({
        open: (openProps) => {
          const { title, initialValue, mode, record = {} } = openProps;
          setValue(initialValue);
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
            visible.setFalse();
            form.resetFields();
            setValue({});
            onCancel?.(e);
          }}
          okButtonProps={{
            style: { display: readOnly ? 'none' : 'inline-block' },
          }}
          cancelButtonProps={{ type: readOnly ? 'primary' : 'default' }}
          onOk={async (e) => {
            confirmLoading.setTrue();
            const { errorFields } = await form.validateFields().catch(identity);
            if (errorFields) {
              confirmLoading.setFalse();
              return;
            }
            submit?.({
              mode,
              data: form.getFieldsValue(),
              record,
            })
              .then((status) => {
                if (status === 'success') {
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
    });

    ModalPlus.displayName = `withModal(${getDisplayName(FormComponent)})`;

    return React.memo(ModalPlus);
  };
};
