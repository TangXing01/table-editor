# Table Editor

一个基于 React + TypeScript 的变量表格编辑器，支持增删改查操作和数据校验。

## 运行方式

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm test
```

## 项目结构

```
table-editor/
├── src/
│   ├── App.tsx                    # 应用根组件
│   ├── main.tsx                   # 入口文件
│   ├── components/
│   │   ├── VariableTable.tsx      # 主表格组件（含 useReducer 状态管理）
│   │   ├── EditableCell.tsx       # 可编辑单元格（单击编辑，回车/失焦保存）
│   │   └── DataTypeSelect.tsx     # 数据类型下拉选择（双击激活）
│   ├── types/
│   │   └── index.ts               # TypeScript 类型定义
│   ├── validators/
│   │   └── index.ts               # 校验逻辑（名称唯一性、BOOL/INT 值校验）
│   └── constants/
│       └── index.ts               # 常量定义（数据类型选项、取值范围等）
├── tests/
│   ├── validators.test.ts         # 校验函数单元测试
│   └── VariableTable.test.tsx     # 表格 Reducer 逻辑测试
├── index.html                     # HTML 模板
├── package.json
├── vite.config.ts                 # Vite 配置
├── tsconfig.json                  # TypeScript 配置
└── README.md
```

## 技术选型

| 技术 | 用途 |
|------|------|
| React 18 | UI 框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具，快速 HMR |
| Ant Design | UI 组件库（Table, Button, Input, Select, Radio 等） |
| useReducer | 状态管理，无第三方库依赖 |
| Vitest | 单元测试框架 |
| React Testing Library | 组件测试 |

## 功能特性

- **表格展示**：显示 Index, Name, Data Type, Default Value, Comment 列
- **添加行**：在表格末尾添加空行，Index 自动递增
- **删除行**：选中行后删除，剩余行 Index 自动重算
- **编辑名称**：支持唯一性校验（不区分大小写）
- **数据类型选择**：BOOL / INT，切换时自动重置默认值
- **默认值校验**：
  - BOOL：仅接受 true/false（不区分大小写），统一显示大写
  - INT：接受 -2147483648 ~ 2147483647 范围内的整数
- **注释编辑**：接受任意文本
