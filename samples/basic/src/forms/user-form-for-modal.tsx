import { FormInstance, Form, Input, InputNumber, Select } from "antd";
import { FormMode } from "antd-form-with";

const UserForm = (props: { form: FormInstance; mode: FormMode }) => {
  const { form, mode } = props;

  return (
    <Form form={form}>
      <Form.Item label="姓名" name={"name"} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="年龄" name={"age"} rules={[{ required: true }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="性别" name={"sex"} rules={[{ required: true }]}>
        <Select
          options={[
            { label: "男", value: "male" },
            { label: "女", value: "female" },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default UserForm;
