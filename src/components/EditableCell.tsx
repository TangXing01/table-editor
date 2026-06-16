import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';

interface EditableCellProps {
  value: string;
  onSave: (value: string) => void;
  /** 是否显示错误状态 */
  hasError?: boolean;
}

/**
 * 可编辑单元格组件
 * 单击进入编辑模式，失焦或回车确认
 */
const EditableCell: React.FC<EditableCellProps> = ({ value, onSave, hasError }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  // 当外部 value 变化时同步
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleClick = () => {
    setEditing(true);
    setInputValue(value);
  };

  const handleConfirm = () => {
    setEditing(false);
    onSave(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  if (editing) {
    return (
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleConfirm}
        onKeyDown={handleKeyDown}
        size="small"
        status={hasError ? 'error' : undefined}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        minHeight: 22,
        padding: '0 4px',
        border: hasError ? '1px solid #ff4d4f' : '1px solid transparent',
        borderRadius: 4,
      }}
    >
      {value || <span style={{ color: '#bbb' }}>-</span>}
    </div>
  );
};

export default EditableCell;
