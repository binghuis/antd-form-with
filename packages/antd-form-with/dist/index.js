"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/with-modal.tsx






var _react = require('react');
var _antd = require('antd');
var _lodashes = require('lodash-es');

// src/hooks/use-boolean.tsx

function useBoolean(defaultValue) {
  const [state, setValue] = _react.useState.call(void 0, !!defaultValue);
  const setTrue = _react.useCallback.call(void 0, () => setValue(true), []);
  const setFalse = _react.useCallback.call(void 0, () => setValue(false), []);
  const toggle = _react.useCallback.call(void 0, () => setValue((x) => !x), []);
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

var getDisplayName = (Component) => {
  return Component.displayName || Component.name || "Component";
};
var filterNonEmpty = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => !_lodashes.isNil.call(void 0, v))
  );
};

// src/with-modal.tsx
var _jsxruntime = require('react/jsx-runtime');
var useModalRef = () => {
  return _react.useRef.call(void 0, null);
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
  } = _nullishCoalesce(props, () => ( {}));
  return (FormComponent) => {
    const WrappedFormComponent = _react.forwardRef.call(void 0, (_, ref) => {
      const [title, setTitle] = _react.useState.call(void 0, );
      const [mode, setMode] = _react.useState.call(void 0, "view" /* View */);
      const [value, setValue] = _react.useState.call(void 0, );
      const [record, setRecord] = _react.useState.call(void 0, {});
      const confirmLoading = use_boolean_default();
      const visible = use_boolean_default();
      const [form] = _antd.Form.useForm();
      const readOnly = _react.useMemo.call(void 0, () => {
        return mode === "view" /* View */;
      }, [mode]);
      _react.useImperativeHandle.call(void 0, ref, () => ({
        open: (openProps) => {
          const { title: title2, initialValue, mode: mode2, record: record2 = {} } = openProps;
          if (!_lodashes.isEmpty.call(void 0, initialValue)) {
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
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _antd.Modal,
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
            const { errorFields } = await form.validateFields().catch(_lodashes.identity);
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
          children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FormComponent, { form, mode, data: _nullishCoalesce(value, () => ( {})) })
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










// src/components/table-searcher.tsx
var _icons = require('@ant-design/icons');


var TableSearcher = (props) => {
  const { search, reset, FormComponent, resetLoading, searchLoading } = props;
  const fold = use_boolean_default();
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _antd.Row, { justify: "space-between", gutter: 8, wrap: false, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _antd.Col, { flex: 1, children: FormComponent }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _antd.Col, { flex: 0, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _antd.Space, { align: "start", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _antd.Tooltip, { title: "\u67E5\u8BE2", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _antd.Button,
        {
          loading: searchLoading,
          type: "primary",
          icon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icons.SearchOutlined, {}),
          onClick: () => {
            search();
          }
        }
      ) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _antd.Space, { direction: "vertical", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _antd.Tooltip, { title: "\u91CD\u7F6E", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _antd.Button,
        {
          loading: resetLoading,
          icon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icons.ReloadOutlined, {}),
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

var useTableRef = () => {
  return _react.useRef.call(void 0, null);
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
  const [form] = _antd.Form.useForm();
  const [data, setData] = _react.useState.call(void 0, );
  const [formVal, setFormVal] = _react.useState.call(void 0, {});
  const [pagination, setPagination] = _react.useState.call(void 0, DefaultPagination);
  const [filterVal, setFilterVal] = _react.useState.call(void 0, );
  const [sorterVal, setSorterVal] = _react.useState.call(void 0, );
  const fetchData = (params) => {
    const {
      current = DefaultPagination.current,
      pageSize: pageSize2 = DefaultPagination.pageSize,
      filters,
      sorter,
      extra = {}
    } = _nullishCoalesce(params, () => ( {}));
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
  _react.useEffect.call(void 0, () => {
    loading.setTrue();
    fetchData({
      ...pagination,
      filters: filterVal,
      sorter: sorterVal,
      extra: formVal
    });
  }, [formVal, pagination.current, pagination.pageSize, sorterVal, filterVal]);
  const TablePlus = _react.forwardRef.call(void 0, (TablePlusProps, ref) => {
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
    _react.useImperativeHandle.call(void 0, ref, () => ({
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
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
      FormComponent && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        table_searcher_default,
        {
          FormComponent: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FormComponent, { form }),
          searchLoading: searchLoading.state,
          resetLoading: resetLoading.state,
          reset,
          search
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _antd.Table,
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
              _lodashes.pick.call(void 0, pagination2, ["current", "pageSize", "total"])
            );
          }
        }
      )
    ] });
  });
  return TablePlus;
};






exports.FormMode = FormMode; exports.useModalRef = useModalRef; exports.useTableRef = useTableRef; exports.withModal = withModal; exports.withTable = withTable;
//# sourceMappingURL=index.js.map