import type { DataType } from '../types';

/** 数据类型选项 */
export const DATA_TYPE_OPTIONS: { label: string; value: DataType }[] = [
  { label: 'BOOL', value: 'BOOL' },
  { label: 'INT', value: 'INT' },
];

/** INT 类型的取值范围 */
export const INT_MIN = -2147483648;
export const INT_MAX = 2147483647;

/** 切换数据类型时的默认值映射 */
export const DEFAULT_VALUE_MAP: Record<DataType, string> = {
  BOOL: 'TRUE',
  INT: '0',
  '': '',
};
