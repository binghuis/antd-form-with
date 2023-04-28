import { FormInstance, Form, Input, InputNumber, Select } from "antd";
import { FormMode } from "antd-form-with";

const UserForm = (props: { form: FormInstance; mode: FormMode }) => {
  const { form, mode } = props;

  return (
    <Form form={form}>
      <Form.Item label="name" name={"name"} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="age" name={"age"} rules={[{ required: true }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="sex" name={"sex"} rules={[{ required: true }]}>
        <Select
          options={[
            { label: "male", value: "male" },
            { label: "female", value: "female" },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default UserForm;
