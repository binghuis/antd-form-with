import { Form, FormInstance, Table, TableProps } from 'antd';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import React from 'react';
import useBoolean from './hooks/use-boolean';
import { TablePlusSearcherProps } from './table-searcher-with';
import { filterNonEmpty, getDisplayName } from './util';

interface withTableRef {
  refresh: () => void;
}

export const useTableRef = () => {
  return useRef<withTableRef>(null);
};

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

interface ServiceResponse<Item> {
  total: number;
  list: Item[];
}

interface ServiceParams<F, R> extends Pagination {
  query?: Partial<F>;
  filters?: Record<string, FilterValue | null>;
  sorter?: SorterResult<R> | SorterResult<R>[];
}

interface Service<F, R> {
  (params: ServiceParams<F, R>): Promise<ServiceResponse<R>>;
}

type FetchData<F, R> = (params?: ServiceParams<F, R>) => void;

type TablePlusProps<R> = {
  title?: React.ReactNode;
  extra?: React.ReactNode;
} & Omit<
  TableProps<R>,
  'dataSource' | 'pagination' | 'onChange' | 'loading' | 'title' | 'caption'
>;

export const withTable = <
  FormType extends object | null,
  RecordType extends object,
>(params: {
  pageSize?: number;
  service: Service<FormType, RecordType>;
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
  const [paginationVal, setPaginationVal] =
    useState<Pagination>(DefaultPagination);
  const [filterVal, setFilterVal] =
    useState<ServiceParams<FormType, RecordType>['filters']>();
  const [sorterVal, setSorterVal] =
    useState<ServiceParams<FormType, RecordType>['sorter']>();

  const fetchData: FetchData<FormType, RecordType> = (params) => {
    const {
      current = paginationVal.current,
      pageSize = paginationVal.pageSize,
      filters = filterVal,
      sorter = sorterVal,
    } = params ?? {};

    loading.setTrue();

    service({
      current,
      pageSize,
      filters,
      sorter,
      query: filterNonEmpty(form.getFieldsValue()),
    }).then(({ total, list }) => {
      setData(list);
      setPaginationVal((pagination) => ({
        ...pagination,
        current,
        pageSize,
        total,
      }));
      setFilterVal(filters);
      setSorterVal(sorter);
      loading.setFalse();
      searchLoading.setFalse();
      resetLoading.setFalse();
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (TablePlusSearcher?: React.ComponentType<TablePlusSearcherProps>) => {
    const TablePlus = forwardRef<withTableRef, TablePlusProps<RecordType>>(
      (props, ref) => {
        const { rowKey = 'id', title, extra, columns, ...nestProps } = props;

        const reset = () => {
          resetLoading.setTrue();
          form.resetFields();
          fetchData({ current: 1 });
        };

        const search = () => {
          searchLoading.setTrue();
          fetchData({ current: 1 });
        };

        useImperativeHandle(ref, () => ({
          refresh() {
            fetchData({ current: 1 });
          },
        }));

        return (
          <div>
            {TablePlusSearcher && (
              <TablePlusSearcher
                form={form}
                searchLoading={searchLoading.state}
                resetLoading={resetLoading.state}
                reset={reset}
                search={search}
              />
            )}
            <Table<RecordType>
              {...nestProps}
              rowKey={rowKey}
              columns={columns?.map((column) => {
                if (!column.render) {
                  column.render = (value) => {
                    return value ? value : '-';
                  };
                }
                return column;
              })}
              caption={
                title || extra ? (
                  <div className="flex justify-between mb-2">
                    {title && <div className="text-lg">{title}</div>}
                    {extra && <div>{extra}</div>}
                  </div>
                ) : null
              }
              loading={loading.state}
              dataSource={data}
              pagination={{ ...paginationVal, showQuickJumper: true }}
              onChange={(pagination, filters, sorter, { action }) => {
                if (action === 'filter') {
                  fetchData({ filters });
                }
                if (action === 'sort') {
                  fetchData({ sorter });
                }
                fetchData({
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                });
              }}
            />
          </div>
        );
      },
    );

    TablePlus.displayName = `withTable(${
      TablePlusSearcher ? getDisplayName(TablePlusSearcher) : 'null'
    })`;

    return React.memo(TablePlus);
  };
};
