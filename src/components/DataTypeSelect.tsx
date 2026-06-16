import React, { useState, useRef, useEffect } from 'react';
import { Select } from 'antd';
import { DATA_TYPE_OPTIONS } from '../constants';
import type { DataType } from '../types';

interface DataTypeSelectProps {
  value: DataType;
  onChange: (value: DataType) => void;
}

/**
 * 数据类型选择组件
 * 双击进入选择模式
 */
const DataTypeSelect: React.FC<DataTypeSelectProps> = ({ value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const selectRef = useRef<any>(null);

  useEffect(() => {
    if (editing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [editing]);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (newValue: DataType) => {
    setEditing(false);
    onChange(newValue);
  };

  const handleBlur = () => {
    setEditing(false);
  };

  if (editing) {
    return (
      <Select
        ref={selectRef}
        value={value || undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        options={DATA_TYPE_OPTIONS}
        size="small"
        style={{ width: '100%' }}
        placeholder="Select type"
        open={true}
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        cursor: 'pointer',
        minHeight: 22,
        padding: '0 4px',
        border: '1px solid transparent',
        borderRadius: 4,
      }}
    >
      {value || <span style={{ color: '#bbb' }}>-</span>}
    </div>
  );
};

export default DataTypeSelect;
