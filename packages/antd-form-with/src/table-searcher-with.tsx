import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Form,
  FormInstance,
  Row,
  Space,
  Tooltip,
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react';

export interface TablePlusSearcherProps {
  search: () => void;
  reset: () => void;
  form: FormInstance;
  resetLoading: boolean;
  searchLoading: boolean;
}

const tableSearcherWith = (
  FormComponent: FunctionComponent<{ form: FormInstance }>,
) => {
  const TableSearcher: React.FC<TablePlusSearcherProps> = (props) => {
    const { search, reset, form, resetLoading, searchLoading } = props;
    return (
      <div>
        <Row justify={'space-between'} gutter={8} wrap={false}>
          <Col flex={1}>
            <FormComponent form={form} />
          </Col>
          <Col flex={0}>
            <Space align="start">
              <Button
                loading={searchLoading}
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  search();
                }}
              >
                查询
              </Button>
              <Space direction="vertical">
                <Button
                  loading={resetLoading}
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    reset();
                  }}
                >
                  重置
                </Button>
                {/* <Tooltip title={fold.state ? '收起' : '展开'}>
                <Button
                  type='dashed'
                  icon={fold.state ? <UpOutlined /> : <DownOutlined />}
                  onClick={() => {
                    fold.toggle();
                  }}
                />
              </Tooltip> */}
              </Space>
            </Space>
          </Col>
        </Row>
        <Divider />
      </div>
    );
  };
  return React.memo(TableSearcher);
};

export { tableSearcherWith };
