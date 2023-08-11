import { FormInstance } from 'antd';
import { FunctionComponent } from 'react';

export interface PlainObject {
  [key: string]: unknown;
}

export enum FormMode {
  View = 'view',
  Copy = 'copy',
  Add = 'add',
  Edit = 'edit',
}
