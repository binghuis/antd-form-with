import { Col, DatePicker, Form, FormInstance, Input, Row, Select } from 'antd';

const UserForm = (props: { form: FormInstance }) => {
  const { form } = props;

  return (
    <Form
      form={form}
      labelCol={{
        md: { span: 8 },
        lg: { span: 6 },
        xl: { span: 6 },
        xxl: { span: 6 },
      }}
      initialValues={{ userId: 1, sex: 'male' }}
    >
      <Row>
        <Col md={12} lg={8} xl={8} xxl={6}>
          <Form.Item label="ID" name="userId" style={{ marginBottom: 8 }}>
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} lg={8} xl={8} xxl={6}>
          <Form.Item label="姓名" name="name" style={{ marginBottom: 8 }}>
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} lg={8} xl={8} xxl={6}>
          <Form.Item label="性别" name="sex" style={{ marginBottom: 8 }}>
            <Select
              options={[
                { label: '男', value: 'male' },
                { label: '女', value: 'female' },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;
