import { Form, FormInstance, Table, TableProps } from "antd";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { pick } from "lodash-es";
import useBoolean from "./hooks/use-boolean";
import React from "react";
import TableSearcher from "./components/table-searcher";
import { PlainObject } from "./types";
import { filterNonEmpty } from "./util";

export const useTableRef = () => {
  return useRef<withTableRef>(null);
};

interface ServiceResponse<Item> {
  total: number;
  list: Item[];
}

interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
}

interface ServiceParams<RecordType> extends Pagination {
  extra: PlainObject;
  filters?: Record<string, FilterValue | null>;
  sorter?: SorterResult<RecordType> | SorterResult<RecordType>[];
}

interface Service<RecordType> {
  (params: ServiceParams<RecordType>): Promise<ServiceResponse<RecordType>>;
}

type FetchData<RecordType> = (params?: ServiceParams<RecordType>) => void;

interface withTableRef {
  refresh: () => void;
}

interface TablePlusProps<RecordType>
  extends Omit<
    TableProps<RecordType>,
    "dataSource" | "pagination" | "onChange" | "loading"
  > {}

export const withTable = <RecordType extends PlainObject>(params: {
  pageSize?: number;
  service: Service<RecordType>;
}) => {
  const { pageSize = 10, service } = params;
  const DefaultPagination: Pagination = {
    current: 1,
    pageSize,
    total: pageSize,
  };
  const loading = useBoolean();
  const resetLoading = useBoolean();
  const searchLoading = useBoolean();
  const [form] = Form.useForm();
  const [data, setData] = useState<RecordType[]>();
  const [formVal, setFormVal] = useState<PlainObject>({});
  const [pagination, setPagination] = useState<Pagination>(DefaultPagination);
  const [filterVal, setFilterVal] =
    useState<ServiceParams<RecordType>["filters"]>();
  const [sorterVal, setSorterVal] =
    useState<ServiceParams<RecordType>["sorter"]>();

  const fetchData: FetchData<RecordType> = (params) => {
    const {
      current = DefaultPagination.current,
      pageSize = DefaultPagination.pageSize,
      filters,
      sorter,
      extra = {},
    } = params ?? {};

    service({
      current,
      pageSize,
      filters,
      sorter,
      extra,
    }).then(({ total, list }) => {
      setData(list);
      setPagination((pagination) => ({ ...pagination, total }));
      loading.setFalse();
      searchLoading.setFalse();
      resetLoading.setFalse();
    });
  };

  useEffect(() => {
    loading.setTrue();
    fetchData({
      ...pagination,
      filters: filterVal,
      sorter: sorterVal,
      extra: formVal,
    });
  }, [formVal, pagination.current, pagination.pageSize, sorterVal, filterVal]);

  return (
    FormComponent?: React.ComponentType<{
      form: FormInstance;
    }>
  ) => {
    const TablePlus = forwardRef<withTableRef, TablePlusProps<RecordType>>(
      (props, ref) => {
        const { rowKey = "id", sticky = true, title, ...nestProps } = props;

        const reset = () => {
          resetLoading.setTrue();
          setPagination((pagination) => ({ ...pagination, current: 1 }));
          form.resetFields();
          setFormVal({});
        };

        const search = () => {
          searchLoading.setTrue();
          setPagination((pagination) => ({ ...pagination, current: 1 }));
          setFormVal(filterNonEmpty(form.getFieldsValue()));
        };

        useImperativeHandle(ref, () => ({
          refresh() {
            loading.setTrue();
            fetchData({
              ...pagination,
              current: 1,
              filters: filterVal,
              sorter: sorterVal,
              extra: formVal,
            });
          },
        }));

        return (
          <div>
            {FormComponent && (
              <TableSearcher
                FormComponent={<FormComponent form={form} />}
                searchLoading={searchLoading.state}
                resetLoading={resetLoading.state}
                reset={reset}
                search={search}
              />
            )}
            <Table<RecordType>
              {...nestProps}
              rowKey={rowKey}
              title={(list) => {
                return <div style={{ textAlign: "left" }}>{title?.(list)}</div>;
              }}
              sticky={sticky}
              loading={loading.state}
              dataSource={data}
              pagination={{ ...pagination, showQuickJumper: true }}
              onChange={(pagination, filters, sorter, { action }) => {
                if (action === "filter") {
                  setFilterVal(filters);
                }
                if (action === "sort") {
                  setSorterVal(sorter);
                }
                setPagination(
                  pick(pagination, [
                    "current",
                    "pageSize",
                    "total",
                  ]) as Pagination
                );
              }}
            />
          </div>
        );
      }
    );
    return TablePlus;
  };
};
