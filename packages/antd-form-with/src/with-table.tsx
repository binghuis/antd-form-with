import TableSearcher from './components/table-searcher';
import useBoolean from './hooks/use-boolean';
import { filterNonEmpty, getDisplayName } from './util';
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

interface ServiceParams<RecordType, FormType> extends Pagination {
  searcher?: Partial<FormType>;
  filters?: Record<string, FilterValue | null>;
  sorter?: SorterResult<RecordType> | SorterResult<RecordType>[];
}

interface Service<RecordType, FormType> {
  (params: ServiceParams<RecordType, FormType>): Promise<
    ServiceResponse<RecordType>
  >;
}

type FetchData<RecordType, FormType> = (
  params?: ServiceParams<RecordType, FormType>,
) => void;

type TablePlusProps<RecordType> = Omit<
  TableProps<RecordType>,
  'dataSource' | 'pagination' | 'onChange' | 'loading'
>;

export const withTable = <
  RecordType extends object,
  FormType extends object,
>(params: {
  pageSize?: number;
  service: Service<RecordType, FormType>;
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
    useState<ServiceParams<RecordType, FormType>['filters']>();
  const [sorterVal, setSorterVal] =
    useState<ServiceParams<RecordType, FormType>['sorter']>();

  const fetchData: FetchData<RecordType, FormType> = (params) => {
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
      searcher: filterNonEmpty(form.getFieldsValue()),
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

  return (
    FormComponent?: React.ComponentType<{
      form: FormInstance;
    }>,
  ) => {
    const TablePlus = forwardRef<withTableRef, TablePlusProps<RecordType>>(
      (props, ref) => {
        const { rowKey = 'id', title, ...nestProps } = props;

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
                return <div>{title?.(list)}</div>;
              }}
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
      FormComponent ? getDisplayName(FormComponent) : 'null'
    })`;

    return React.memo(TablePlus);
  };
};
