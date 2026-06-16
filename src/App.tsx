import React from 'react';
import { ConfigProvider } from 'antd';
import VariableTable from './components/VariableTable';

/**
 * 应用根组件
 */
const App: React.FC = () => {
  return (
    <ConfigProvider>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ marginBottom: 24 }}>Table Editor</h1>
        <VariableTable />
      </div>
    </ConfigProvider>
  );
};

export default App;
