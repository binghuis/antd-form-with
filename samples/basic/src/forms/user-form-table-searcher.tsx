import UserForm from './user-form-table';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, FormInstance, Row, Space, Tooltip } from 'antd';
import React from 'react';

interface TablePlusSearcher {
  search: () => void;
  reset: () => void;
  form: FormInstance;
  resetLoading: boolean;
  searchLoading: boolean;
}

const TableSearcher: React.FC<TablePlusSearcher> = (props) => {
  const { search, reset, form, resetLoading, searchLoading } = props;
  return (
    <Row justify={'space-between'} gutter={8} wrap={false}>
      <Col flex={1}>
        <UserForm form={form} />
      </Col>
      <Col flex={0}>
        <Space align='start'>
          {/* <Tooltip title='查询'> */}
          <Button
            loading={searchLoading}
            type='primary'
            icon={<SearchOutlined />}
            onClick={() => {
              search();
            }}
          >
            查询
          </Button>
          {/* </Tooltip> */}
          <Space direction='vertical'>
            {/* <Tooltip title='重置'> */}
            <Button
              loading={resetLoading}
              icon={<ReloadOutlined />}
              onClick={() => {
                reset();
              }}
            >
              重置
            </Button>
            {/* </Tooltip> */}
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
  );
};
export default React.memo(TableSearcher);
