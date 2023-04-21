import React from 'react';
import { ModalProps, FormInstance, TableProps } from 'antd';
import { FilterValue, SorterResult } from 'antd/es/table/interface';

interface PlainObject {
    [key: string]: unknown;
}
declare enum FormMode {
    View = "view",
    Copy = "copy",
    Add = "add",
    Edit = "edit"
}

declare const useModalRef: <InitialValue extends PlainObject>() => React.RefObject<withModalRef<InitialValue>>;
type Title = ModalProps["title"];
interface withModalRef<InitialValue> {
    open: (openProps: {
        title: Title;
        initialValue?: Partial<InitialValue>;
        mode?: FormMode;
        record?: PlainObject;
    }) => void;
}
declare const withModal: <FormVal extends PlainObject>(props?: (Partial<Omit<ModalProps, "title">> & {
    submit?: ((params: {
        mode: FormMode;
        data: FormVal;
        record: PlainObject;
    }) => Promise<void>) | undefined;
    onError?: VoidFunction | undefined;
}) | undefined) => (FormComponent: React.ComponentType<{
    form: FormInstance;
    mode: FormMode;
    data: Partial<FormVal>;
}>) => React.ForwardRefExoticComponent<React.RefAttributes<withModalRef<FormVal>>>;

declare const useTableRef: () => React.RefObject<withTableRef>;
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
interface withTableRef {
    refresh: () => void;
}
declare const withTable: <RecordType extends PlainObject>(props: {
    pageSize?: number | undefined;
    service: Service<RecordType>;
    FormComponent?: React.ComponentType<{
        form: FormInstance;
    }> | undefined;
}) => React.ForwardRefExoticComponent<Omit<TableProps<RecordType>, "onChange" | "loading" | "dataSource" | "pagination"> & React.RefAttributes<withTableRef>>;

export { FormMode, useModalRef, useTableRef, withModal, withTable };
