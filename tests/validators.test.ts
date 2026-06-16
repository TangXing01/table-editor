import { describe, it, expect } from 'vitest';
import { validateName, validateBoolValue, validateIntValue } from '../src/validators';
import type { Variable } from '../src/types';

/** 辅助：创建测试用变量 */
function makeVariable(overrides: Partial<Variable> = {}): Variable {
  return {
    id: 'test-id',
    index: 1,
    name: 'testVar',
    dataType: '',
    defaultValue: '',
    comment: '',
    ...overrides,
  };
}

describe('validateName', () => {
  const existingVars: Variable[] = [
    makeVariable({ id: '1', name: 'Alpha' }),
    makeVariable({ id: '2', name: 'Beta' }),
  ];

  it('should return error for empty name', () => {
    expect(validateName('', existingVars, '3')).toBe('Name cannot be empty');
    expect(validateName('   ', existingVars, '3')).toBe('Name cannot be empty');
  });

  it('should return error for duplicate name (case insensitive)', () => {
    expect(validateName('alpha', existingVars, '3')).toBe('Name already exists');
    expect(validateName('ALPHA', existingVars, '3')).toBe('Name already exists');
    expect(validateName('Alpha', existingVars, '3')).toBe('Name already exists');
  });

  it('should allow editing own name (excludeId)', () => {
    expect(validateName('Alpha', existingVars, '1')).toBeNull();
  });

  it('should pass for unique non-empty name', () => {
    expect(validateName('Gamma', existingVars, '3')).toBeNull();
    expect(validateName('Delta', existingVars, '3')).toBeNull();
  });
});

describe('validateBoolValue', () => {
  it('should accept TRUE/FALSE in any case', () => {
    expect(validateBoolValue('true')).toBeNull();
    expect(validateBoolValue('TRUE')).toBeNull();
    expect(validateBoolValue('false')).toBeNull();
    expect(validateBoolValue('FALSE')).toBeNull();
    expect(validateBoolValue('True')).toBeNull();
    expect(validateBoolValue('False')).toBeNull();
  });

  it('should reject invalid bool values', () => {
    expect(validateBoolValue('yes')).not.toBeNull();
    expect(validateBoolValue('no')).not.toBeNull();
    expect(validateBoolValue('1')).not.toBeNull();
    expect(validateBoolValue('0')).not.toBeNull();
    expect(validateBoolValue('')).not.toBeNull();
    expect(validateBoolValue('abc')).not.toBeNull();
  });
});

describe('validateIntValue', () => {
  it('should accept valid integers within range', () => {
    expect(validateIntValue('0')).toBeNull();
    expect(validateIntValue('123')).toBeNull();
    expect(validateIntValue('-456')).toBeNull();
    expect(validateIntValue('2147483647')).toBeNull();
    expect(validateIntValue('-2147483648')).toBeNull();
  });

  it('should reject non-integer values', () => {
    expect(validateIntValue('1.5')).not.toBeNull();
    expect(validateIntValue('abc')).not.toBeNull();
    expect(validateIntValue('')).not.toBeNull();
    expect(validateIntValue('12.0')).not.toBeNull();
    expect(validateIntValue('1e5')).not.toBeNull();
  });

  it('should reject out-of-range integers', () => {
    expect(validateIntValue('2147483648')).not.toBeNull();
    expect(validateIntValue('-2147483649')).not.toBeNull();
    expect(validateIntValue('99999999999')).not.toBeNull();
  });
});
