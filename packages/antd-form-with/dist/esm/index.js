// src/with-modal.tsx
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState as useState2
} from "react";
import { Modal, Form } from "antd";
import { identity, isEmpty } from "lodash-es";

// src/hooks/use-boolean.tsx
import { useCallback, useState } from "react";
function useBoolean(defaultValue) {
  const [state, setValue] = useState(!!defaultValue);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((x) => !x), []);
  return { state, setValue, setTrue, setFalse, toggle };
}
var use_boolean_default = useBoolean;

// src/types.ts
var FormMode = /* @__PURE__ */ ((FormMode2) => {
  FormMode2["View"] = "view";
  FormMode2["Copy"] = "copy";
  FormMode2["Add"] = "add";
  FormMode2["Edit"] = "edit";
  return FormMode2;
})(FormMode || {});

// src/util.tsx
import { isNil } from "lodash-es";
var getDisplayName = (Component) => {
  return Component.displayName || Component.name || "Component";
};
var filterNonEmpty = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => !isNil(v))
  );
};

// src/with-modal.tsx
import { jsx } from "react/jsx-runtime";
var useModalRef = () => {
  return useRef(null);
};
var withModal = (props) => {
  const {
    cancelText,
    okText,
    onError,
    onOk,
    onCancel,
    destroyOnClose = true,
    submit,
    ...nestProps
  } = props ?? {};
  return (FormComponent) => {
    const WrappedFormComponent = forwardRef((_, ref) => {
      const [title, setTitle] = useState2();
      const [mode, setMode] = useState2("view" /* View */);
      const [value, setValue] = useState2();
      const [record, setRecord] = useState2({});
      const confirmLoading = use_boolean_default();
      const visible = use_boolean_default();
      const [form] = Form.useForm();
      const readOnly = useMemo(() => {
        return mode === "view" /* View */;
      }, [mode]);
      useImperativeHandle(ref, () => ({
        open: (openProps) => {
          const { title: title2, initialValue, mode: mode2, record: record2 = {} } = openProps;
          if (!isEmpty(initialValue)) {
            setValue(initialValue);
            form.setFieldsValue(initialValue);
          }
          setRecord(record2);
          if (mode2) {
            setMode(mode2);
          }
          setTitle(title2);
          visible.setTrue();
        }
      }));
      return /* @__PURE__ */ jsx(
        Modal,
        {
          title,
          open: visible.state,
          okText,
          onCancel: (e) => {
            onCancel == null ? void 0 : onCancel(e);
            visible.setFalse();
          },
          okButtonProps: {
            style: { display: readOnly ? "none" : "inline-block" }
          },
          cancelButtonProps: { type: readOnly ? "primary" : "default" },
          onOk: async (e) => {
            confirmLoading.setTrue();
            const { errorFields } = await form.validateFields().catch(identity);
            if (errorFields) {
              confirmLoading.setFalse();
              return;
            }
            submit == null ? void 0 : submit({ mode, data: form.getFieldsValue(), record }).then(() => {
              confirmLoading.setFalse();
              onOk == null ? void 0 : onOk(e);
            }).catch(() => {
              onError == null ? void 0 : onError();
            });
          },
          destroyOnClose,
          confirmLoading: confirmLoading.state,
          cancelText,
          ...nestProps,
          children: /* @__PURE__ */ jsx(FormComponent, { form, mode, data: value ?? {} })
        }
      );
    });
    WrappedFormComponent.displayName = `withModal(${getDisplayName(
      FormComponent
    )})`;
    return WrappedFormComponent;
  };
};

// src/with-table.tsx
import { Form as Form2, Table } from "antd";
import {
  forwardRef as forwardRef2,
  useEffect,
  useImperativeHandle as useImperativeHandle2,
  useRef as useRef2,
  useState as useState3
} from "react";
import { pick } from "lodash-es";

// src/components/table-searcher.tsx
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Tooltip } from "antd";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var TableSearcher = (props) => {
  const { search, reset, FormComponent, resetLoading, searchLoading } = props;
  const fold = use_boolean_default();
  return /* @__PURE__ */ jsxs(Row, { justify: "space-between", gutter: 8, wrap: false, children: [
    /* @__PURE__ */ jsx2(Col, { flex: 1, children: FormComponent }),
    /* @__PURE__ */ jsx2(Col, { flex: 0, children: /* @__PURE__ */ jsxs(Space, { align: "start", children: [
      /* @__PURE__ */ jsx2(Tooltip, { title: "\u67E5\u8BE2", children: /* @__PURE__ */ jsx2(
        Button,
        {
          loading: searchLoading,
          type: "primary",
          icon: /* @__PURE__ */ jsx2(SearchOutlined, {}),
          onClick: () => {
            search();
          }
        }
      ) }),
      /* @__PURE__ */ jsx2(Space, { direction: "vertical", children: /* @__PURE__ */ jsx2(Tooltip, { title: "\u91CD\u7F6E", children: /* @__PURE__ */ jsx2(
        Button,
        {
          loading: resetLoading,
          icon: /* @__PURE__ */ jsx2(ReloadOutlined, {}),
          onClick: () => {
            reset();
          }
        }
      ) }) })
    ] }) })
  ] });
};
var table_searcher_default = TableSearcher;

// src/with-table.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var useTableRef = () => {
  return useRef2(null);
};
var withTable = (props) => {
  const { pageSize = 10, service, FormComponent } = props;
  const DefaultPagination = {
    current: 1,
    pageSize,
    total: pageSize
  };
  const loading = use_boolean_default();
  const resetLoading = use_boolean_default();
  const searchLoading = use_boolean_default();
  const [form] = Form2.useForm();
  const [data, setData] = useState3();
  const [formVal, setFormVal] = useState3({});
  const [pagination, setPagination] = useState3(DefaultPagination);
  const [filterVal, setFilterVal] = useState3();
  const [sorterVal, setSorterVal] = useState3();
  const fetchData = (params) => {
    const {
      current = DefaultPagination.current,
      pageSize: pageSize2 = DefaultPagination.pageSize,
      filters,
      sorter,
      extra = {}
    } = params ?? {};
    service({
      current,
      pageSize: pageSize2,
      filters,
      sorter,
      extra
    }).then(({ total, list }) => {
      setData(list);
      setPagination((pagination2) => ({ ...pagination2, total }));
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
      extra: formVal
    });
  }, [formVal, pagination.current, pagination.pageSize, sorterVal, filterVal]);
  const TablePlus = forwardRef2((TablePlusProps, ref) => {
    const { rowKey = "id", sticky = true, ...nestProps } = TablePlusProps;
    const reset = () => {
      resetLoading.setTrue();
      setPagination((pagination2) => ({ ...pagination2, current: 1 }));
      form.resetFields();
      setFormVal({});
    };
    const search = () => {
      searchLoading.setTrue();
      setPagination((pagination2) => ({ ...pagination2, current: 1 }));
      setFormVal(filterNonEmpty(form.getFieldsValue()));
    };
    useImperativeHandle2(ref, () => ({
      refresh() {
        loading.setTrue();
        fetchData({
          ...pagination,
          current: 1,
          filters: filterVal,
          sorter: sorterVal,
          extra: formVal
        });
      }
    }));
    return /* @__PURE__ */ jsxs2("div", { children: [
      FormComponent && /* @__PURE__ */ jsx3(
        table_searcher_default,
        {
          FormComponent: /* @__PURE__ */ jsx3(FormComponent, { form }),
          searchLoading: searchLoading.state,
          resetLoading: resetLoading.state,
          reset,
          search
        }
      ),
      /* @__PURE__ */ jsx3(
        Table,
        {
          ...nestProps,
          rowKey,
          sticky,
          loading: loading.state,
          dataSource: data,
          pagination: { ...pagination, showQuickJumper: true },
          onChange: (pagination2, filters, sorter, { action }) => {
            if (action === "filter") {
              setFilterVal(filters);
            }
            if (action === "sort") {
              setSorterVal(sorter);
            }
            setPagination(
              pick(pagination2, ["current", "pageSize", "total"])
            );
          }
        }
      )
    ] });
  });
  return TablePlus;
};
export {
  FormMode,
  useModalRef,
  useTableRef,
  withModal,
  withTable
};
//# sourceMappingURL=index.js.map