import { INT_MIN, INT_MAX } from '../constants';
import type { Variable } from '../types';

/**
 * 校验变量名是否唯一（不区分大小写）
 * @param name 要校验的名称
 * @param variables 当前所有变量
 * @param excludeId 排除的变量 ID（编辑自身时排除）
 * @returns 错误消息，无错误返回 null
 */
export function validateName(
  name: string,
  variables: Variable[],
  excludeId: string
): string | null {
  if (!name.trim()) {
    return 'Name cannot be empty';
  }
  const duplicate = variables.some(
    (v) => v.id !== excludeId && v.name.toLowerCase() === name.toLowerCase()
  );
  if (duplicate) {
    return 'Name already exists';
  }
  return null;
}

/**
 * 校验 BOOL 类型的默认值
 * @param value 输入值
 * @returns 错误消息，无错误返回 null
 */
export function validateBoolValue(value: string): string | null {
  const normalized = value.trim().toUpperCase();
  if (normalized === 'TRUE' || normalized === 'FALSE') {
    return null;
  }
  return 'Invalid BOOL value. Accepted: TRUE / FALSE';
}

/**
 * 校验 INT 类型的默认值
 * @param value 输入值
 * @returns 错误消息，无错误返回 null
 */
export function validateIntValue(value: string): string | null {
  const trimmed = value.trim();
  // 必须是整数格式（可选负号 + 数字）
  if (!/^-?\d+$/.test(trimmed)) {
    return 'Invalid INT value. Must be an integer';
  }
  const num = Number(trimmed);
  if (num < INT_MIN || num > INT_MAX) {
    return `INT value out of range (${INT_MIN} ~ ${INT_MAX})`;
  }
  return null;
}

/**
 * 根据数据类型校验默认值
 */
export function validateDefaultValue(
  value: string,
  dataType: 'BOOL' | 'INT' | ''
): string | null {
  if (dataType === 'BOOL') {
    return validateBoolValue(value);
  }
  if (dataType === 'INT') {
    return validateIntValue(value);
  }
  return null;
}
