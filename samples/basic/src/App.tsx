import { Button, Space, message } from 'antd';
import {
  FormMode,
  tableSearcherWith,
  useModalRef,
  useTableRef,
  withModal,
  withTable,
} from 'antd-form-with';
import qs from 'query-string';
import './App.css';
import UserFormForModal from './forms/user-form-modal';
import UserForm from './forms/user-form-table';
import { User } from './types/user';

function App() {
  const modalRef = useModalRef();

  const UserFormWithModal = withModal<User, User>({
    async submit({ mode, data, record }) {
      if (mode === FormMode.Add) {
        const res = await fetch('/api/users', {
          method: 'POST',
          body: JSON.stringify(data),
        }).then((res) => res.json());
        if (res.code === 'success') {
          return 'success';
        }
      }
      if (mode === FormMode.Edit) {
        const res = await fetch(`/api/users/${record?.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...data, id: record?.id }),
        }).then((res) => res.json());
        if (res.code === 'success') {
          return 'success';
        } else {
          message.error(res.message);
        }
      }
    },
  })(UserFormForModal);

  const tableRef = useTableRef();

  const UserFormWithTable = withTable<User, User>({
    service: async ({ current, pageSize, query, filters, sorter }) => {
      console.log(filters, sorter);

      const data = await fetch(
        `/api/users?${qs.stringify({ ...query, current, pageSize } ?? {})}`,
      ).then((res) => res.json());
      return data;
    },
  })(tableSearcherWith(UserForm));

  return (
    <div className="App">
      <UserFormWithModal
        ref={modalRef}
        onSuccess={() => {
          tableRef.current?.refresh();
        }}
      />

      <UserFormWithTable
        title={'Title'}
        extra={
          <Button
            type="primary"
            onClick={() => {
              modalRef.current?.open({
                title: 'Create Modal',
                mode: FormMode.Add,
              });
            }}
          >
            + New
          </Button>
        }
        ref={tableRef}
        rowKey={'id'}
        columns={[
          {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
          },
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',

            sorter: true,
          },
          {
            title: 'Sex',
            dataIndex: 'sex',
            key: 'sex',
            filters: [
              { text: '男', value: 'male' },
              { text: '女', value: 'female' },
            ],
          },
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Space>
                <button
                  type="button"
                  onClick={() => {
                    modalRef.current?.open({
                      title: 'edit',
                      mode: FormMode.Edit,
                      initialValue: record,
                      record,
                    });
                  }}
                >
                  edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    modalRef.current?.open({
                      title: 'view',
                      mode: FormMode.View,
                      initialValue: record,
                    });
                  }}
                >
                  view
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetch(`/api/users/${record.id}`, {
                      method: 'DELETE',
                    }).then((res) => res.json());
                    if (res.code === 'success') {
                      message.success(res.message);
                      tableRef.current?.refresh();
                    } else {
                      message.error(res.message);
                    }
                  }}
                >
                  del
                </button>
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}

export default App;
