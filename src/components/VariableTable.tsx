import React, { useReducer, useState } from 'react';
import { Table, Button, Space, message, Radio } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Variable, Action, DataType } from '../types';
import { DEFAULT_VALUE_MAP } from '../constants';
import { validateName, validateDefaultValue } from '../validators';
import EditableCell from './EditableCell';
import DataTypeSelect from './DataTypeSelect';

/** 生成唯一 ID */
let idCounter = 0;
function generateId(): string {
  return `var_${++idCounter}_${Date.now()}`;
}

/** 重新计算所有行的 index（从 1 开始） */
function reindex(variables: Variable[]): Variable[] {
  return variables.map((v, i) => ({ ...v, index: i + 1 }));
}

/** Reducer：管理变量列表状态 */
export function variableReducer(state: Variable[], action: Action): Variable[] {
  switch (action.type) {
    case 'ADD_ROW': {
      const newRow: Variable = {
        id: generateId(),
        index: state.length + 1,
        name: '',
        dataType: '',
        defaultValue: '',
        comment: '',
      };
      return [...state, newRow];
    }
    case 'DELETE_ROW': {
      const filtered = state.filter((v) => v.id !== action.id);
      return reindex(filtered);
    }
    case 'UPDATE_CELL': {
      return state.map((v) => {
        if (v.id !== action.id) return v;
        return { ...v, [action.field]: action.value };
      });
    }
    default:
      return state;
  }
}

/**
 * 主表格组件
 */
const VariableTable: React.FC = () => {
  const [variables, dispatch] = useReducer(variableReducer, []);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  /** 添加行 */
  const handleAddRow = () => {
    dispatch({ type: 'ADD_ROW' });
  };

  /** 删除选中行 */
  const handleDeleteRow = () => {
    if (!selectedRowId) {
      message.warning('Please select a row to delete');
      return;
    }
    dispatch({ type: 'DELETE_ROW', id: selectedRowId });
    setSelectedRowId(null);
  };

  /** 编辑名称保存 */
  const handleNameSave = (record: Variable, newName: string) => {
    // 空值校验：恢复原值
    if (!newName.trim()) {
      message.error('Name cannot be empty');
      return;
    }
    // 唯一性校验
    const error = validateName(newName, variables, record.id);
    if (error) {
      message.error(error);
      return;
    }
    dispatch({ type: 'UPDATE_CELL', id: record.id, field: 'name', value: newName.trim() });
  };

  /** 数据类型变更 */
  const handleDataTypeChange = (record: Variable, newType: DataType) => {
    dispatch({ type: 'UPDATE_CELL', id: record.id, field: 'dataType', value: newType });
    // 切换类型时自动重置默认值
    const defaultVal = DEFAULT_VALUE_MAP[newType];
    dispatch({ type: 'UPDATE_CELL', id: record.id, field: 'defaultValue', value: defaultVal });
  };

  /** 默认值保存 */
  const handleDefaultValueSave = (record: Variable, newValue: string) => {
    if (!record.dataType) {
      // 未选择数据类型时，直接保存
      dispatch({ type: 'UPDATE_CELL', id: record.id, field: 'defaultValue', value: newValue });
      return;
    }
    const error = validateDefaultValue(newValue, record.dataType);
    if (error) {
      message.error(error);
      return;
    }
    // BOOL 类型统一大写
    const finalValue =
      record.dataType === 'BOOL' ? newValue.trim().toUpperCase() : newValue.trim();
    dispatch({ type: 'UPDATE_CELL', id: record.id, field: 'defaultValue', value: finalValue });
  };

  /** 注释保存 */
  const handleCommentSave = (record: Variable, newValue: string) => {
    dispatch({ type: 'UPDATE_CELL', id: record.id, field: 'comment', value: newValue });
  };

  const columns = [
    {
      title: '',
      key: 'select',
      width: 50,
      render: (_: unknown, record: Variable) => (
        <Radio
          checked={selectedRowId === record.id}
          onChange={() => setSelectedRowId(record.id)}
        />
      ),
    },
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
      width: 70,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (_: unknown, record: Variable) => (
        <EditableCell
          value={record.name}
          onSave={(val) => handleNameSave(record, val)}
        />
      ),
    },
    {
      title: 'Data Type',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 140,
      render: (_: unknown, record: Variable) => (
        <DataTypeSelect
          value={record.dataType}
          onChange={(val) => handleDataTypeChange(record, val)}
        />
      ),
    },
    {
      title: 'Default Value',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 180,
      render: (_: unknown, record: Variable) => (
        <EditableCell
          value={record.defaultValue}
          onSave={(val) => handleDefaultValueSave(record, val)}
        />
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (_: unknown, record: Variable) => (
        <EditableCell
          value={record.comment}
          onSave={(val) => handleCommentSave(record, val)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRow}>
          Add Row
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleDeleteRow}
          disabled={!selectedRowId}
        >
          Delete Row
        </Button>
      </Space>
      <Table
        dataSource={variables}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="small"
        bordered
        onRow={(record) => ({
          onClick: () => setSelectedRowId(record.id),
          style: {
            background: selectedRowId === record.id ? '#e6f7ff' : undefined,
            cursor: 'pointer',
          },
        })}
      />
    </div>
  );
};

export default VariableTable;
