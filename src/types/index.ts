/**
 * 变量数据模型
 */
export interface Variable {
  id: string;           // 内部唯一 key
  index: number;        // 显示序号，动态计算
  name: string;         // 变量名
  dataType: DataType;   // 数据类型
  defaultValue: string; // 默认值
  comment: string;      // 注释
}

/** 支持的数据类型 */
export type DataType = 'BOOL' | 'INT' | '';

/** Reducer Action 类型 */
export type Action =
  | { type: 'ADD_ROW' }
  | { type: 'DELETE_ROW'; id: string }
  | { type: 'UPDATE_CELL'; id: string; field: keyof Variable; value: string };
