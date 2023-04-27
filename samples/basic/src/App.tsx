import {
  withModal,
  withTable,
  useModalRef,
  useTableRef,
  FormMode,
} from "antd-form-with";
import { Button, Tag, Space } from "antd";
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
      return {
        list: [
          {
            key: "1",
            name: "John Brown",
            age: 32,
            address: "New York No. 1 Lake Park",
            tags: ["nice", "developer"],
          },
          {
            key: "2",
            name: "Jim Green",
            age: 42,
            address: "London No. 1 Lake Park",
            tags: ["loser"],
          },
          {
            key: "3",
            name: "Joe Black",
            age: 32,
            address: "Sydney No. 1 Lake Park",
            tags: ["cool", "teacher"],
          },
        ],
        total: 3,
      };
    },
  })(UserFormForTable);

  return (
    <div className="App">
      <UserFormWithModal ref={modalRef} />
      <Button
        onClick={() => {
          modalRef.current?.open({
            title: "Create Modal",
            mode: FormMode.Add,
          });
        }}
      >
        create
      </Button>
      <UserFormWithTable
        ref={tableRef}
        rowKey={'key'}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
          },
          {
            title: "Age",
            dataIndex: "age",
            key: "age",
          },
          {
            title: "Address",
            dataIndex: "address",
            key: "address",
          },
          {
            title: "Tags",
            key: "tags",
            dataIndex: "tags",
            render: (_, { tags }) => (
              <>
                {tags.map((tag) => {
                  let color = tag.length > 5 ? "geekblue" : "green";
                  if (tag === "loser") {
                    color = "volcano";
                  }
                  return (
                    <Tag color={color} key={tag}>
                      {tag.toUpperCase()}
                    </Tag>
                  );
                })}
              </>
            ),
          },
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Space size="middle">
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
                <a>Delete</a>
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}

export default App;
