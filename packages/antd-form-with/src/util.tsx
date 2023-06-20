import { isNil } from 'lodash-es';

export const getDisplayName = <Props extends object>(
  Component: React.ComponentType<Props>,
) => {
  return Component.displayName || Component.name || 'Component';
};

export const filterNonEmpty = <T extends object>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => !isNil(v)),
  ) as Partial<T>;
};
