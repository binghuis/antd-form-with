import { FormInstance, Form, Input, Row, Col } from "antd";

const UserForm = (props: { form: FormInstance }) => {
  const { form } = props;

  return (
    <Form
      form={form}
      labelCol={{
        md: { span: 8 },
        lg: { span: 8 },
        xl: { span: 5 },
        xxl: { span: 6 },
      }}
    >
      <Row>
        <Col md={12} lg={8} xl={8} xxl={6}>
          <Form.Item label="用户ID" name="userId" style={{ marginBottom: 8 }}>
            <Input></Input>
          </Form.Item>
        </Col>
        <Col md={12} lg={8} xl={8} xxl={6}>
          <Form.Item label="手机号" name="phone" style={{ marginBottom: 8 }}>
            <Input></Input>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;
