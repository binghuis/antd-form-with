import { PlainObject } from './types';
import { isNil } from 'lodash-es';

export const getDisplayName = <Props extends PlainObject>(
  Component: React.ComponentType<Props>,
) => {
  return Component.displayName || Component.name || 'Component';
};

export const filterNonEmpty = <T extends PlainObject>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => !isNil(v)),
  ) as Partial<T>;
};
