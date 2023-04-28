import {
  withModal,
  withTable,
  useModalRef,
  useTableRef,
  FormMode,
} from "antd-form-with";
import { Button, Space } from "antd";
import "./App.css";
import UserFormForModal from "./forms/user-form-for-modal";
import UserFormForTable from "./forms/user-form-for-table";

function App() {
  const modalRef = useModalRef();
  const tableRef = useTableRef();

  const UserFormWithModal = withModal({
    async submit(params) {
      console.log(params);
    },
  })(UserFormForModal);

  const UserFormWithTable = withTable({
    service: async () => {
      const data = await fetch("/api/users").then((res) => res.json());
      return {
        list: data,
        total: data.length,
      };
    },
  })(UserFormForTable);

  return (
    <div className="App">
      <UserFormWithModal ref={modalRef} />

      <UserFormWithTable
        title={() => {
          return (
            <Button
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
        rowKey={"key"}
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
            title: "Birthdate",
            dataIndex: "birthdate",
            key: "birthdate",
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
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}

export default App;
