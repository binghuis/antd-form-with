import {
  withModal,
  withTable,
  useModalRef,
  useTableRef,
  FormMode,
} from "antd-form-with";
import { Button, Space, message } from "antd";
import "./App.css";
import UserFormForModal from "./forms/user-form-for-modal";
import UserFormForTable from "./forms/user-form-for-table";

function App() {
  const modalRef = useModalRef();
  const tableRef = useTableRef();

  const UserFormWithModal = withModal({
    async submit({ mode, data, record }) {
      if (mode === FormMode.Add) {
        const res = await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify(data),
        }).then((res) => res.json());
        if (res.code === "success") {
          return "success";
        }
      }
      if (mode === FormMode.Edit) {
        const res = await fetch(`/api/users/${record.id}`, {
          method: "PUT",
          body: JSON.stringify({ ...data, id: record.id }),
        }).then((res) => res.json());
        if (res.code === "success") {
          return "success";
        } else {
          message.error(res.message);
        }
      }
    },
  })(UserFormForModal);

  const UserFormWithTable = withTable({
    service: async ({ current, pageSize, extra, filters, sorter }) => {
      const data = await fetch(
        `/api/users?current=${current}&pageSize=${pageSize}`
      ).then((res) => res.json());
      return data;
    },
  })(UserFormForTable);

  return (
    <div className="App">
      <UserFormWithModal
        ref={modalRef}
        onSuccess={() => {
          tableRef.current?.refresh();
        }}
      />

      <UserFormWithTable
        title={() => {
          return (
            <Button
              type="primary"
              onClick={() => {
                modalRef.current?.open({
                  title: "Create Modal",
                  mode: FormMode.Add,
                });
              }}
            >
              New
            </Button>
          );
        }}
        ref={tableRef}
        rowKey={"id"}
        columns={[
          {
            title: "Id",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => text,
          },
          {
            title: "Sex",
            dataIndex: "sex",
            key: "sex",
          },
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Space>
                <a
                  onClick={() => {
                    modalRef.current?.open({
                      title: "edit",
                      mode: FormMode.Edit,
                      initialValue: record,
                      record,
                    });
                  }}
                >
                  edit
                </a>
                <a
                  onClick={() => {
                    modalRef.current?.open({
                      title: "view",
                      mode: FormMode.View,
                      initialValue: record,
                    });
                  }}
                >
                  view
                </a>
                <a
                  onClick={async () => {
                    const res = await fetch(`/api/users/${record.id}`, {
                      method: "DELETE",
                    }).then((res) => res.json());
                    if (res.code === "success") {
                      message.success(res.message);
                      tableRef.current?.refresh();
                    } else {
                      message.error(res.message);
                    }
                  }}
                >
                  del
                </a>
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}

export default App;
