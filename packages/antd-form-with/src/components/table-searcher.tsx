import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Tooltip } from "antd";
import React from "react";
import useBoolean from "../hooks/use-boolean";

interface TablePlusSearcher {
  search: () => void;
  reset: () => void;
  FormComponent: React.ReactElement;
  resetLoading: boolean;
  searchLoading: boolean;
}

const TableSearcher: React.FC<TablePlusSearcher> = (props) => {
  const { search, reset, FormComponent, resetLoading, searchLoading } = props;
  return (
    <Row justify={"space-between"} gutter={8} wrap={false}>
      <Col flex={1}>{FormComponent}</Col>
      <Col flex={0}>
        <Space align="start">
          <Tooltip title="查询">
            <Button
              loading={searchLoading}
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                search();
              }}
            />
          </Tooltip>
          <Space direction="vertical">
            <Tooltip title="重置">
              <Button
                loading={resetLoading}
                icon={<ReloadOutlined />}
                onClick={() => {
                  reset();
                }}
              />
            </Tooltip>
            {/* <Tooltip title={fold.state ? '收起' : '展开'}>
              <Button
                type="dashed"
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
