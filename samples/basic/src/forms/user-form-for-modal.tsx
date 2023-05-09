import { Form, FormInstance, Input, Select } from 'antd';
import { FormMode } from 'antd-form-with';

const UserForm = (props: { form: FormInstance; mode: FormMode }) => {
  const { form, mode } = props;

  return (
    <Form form={form} disabled={mode === FormMode.View}>
      <Form.Item label="name" name={'name'} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="sex" name={'sex'} rules={[{ required: true }]}>
        <Select
          options={[
            { label: 'male', value: 'male' },
            { label: 'female', value: 'female' },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default UserForm;
