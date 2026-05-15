import { useState } from 'react';
import { Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface TableSelectProps<T> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: string;
  optionLabelRender?: (record: T) => string; // 自定义选中后的显示文本
  width?: number | string;
  dropdownWidth?: number;
  pagination?: { pageSize: number };
}

function TableSelect<T extends object>({
  value,
  onChange,
  placeholder,
  columns = [],
  dataSource = [],
  rowKey = 'key',
  optionLabelRender,
  width = 240,
  dropdownWidth = 400,
  pagination = { pageSize: 5 },
}: TableSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const handleRowClick = (record: T) => {
    const key = (record as any)[rowKey];
    onChange?.(key);
    setOpen(false);
  };

  return (
    <Select
      placeholder={placeholder}
      style={{ width }}
      value={value}
      onChange={onChange}
      allowClear
      open={open}
      onOpenChange={setOpen}
      dropdownMatchSelectWidth={false}
      popupRender={() => (
        <div 
          className="p-2 shadow-lg bg-white border border-gray-100 rounded-md"
          style={{ minWidth: dropdownWidth }}
        >
          <Table
            size="small"
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 'max-content' }}
            pagination={{ ...pagination, size: 'small', showSizeChanger: false }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' }
            })}
            rowClassName={(record) => (record as any)[rowKey] === value ? 'bg-blue-50' : ''}
          />
        </div>
      )}
    >
      {dataSource.map((item) => (
        <Select.Option key={(item as any)[rowKey]} value={(item as any)[rowKey]}>
          {optionLabelRender ? optionLabelRender(item) : (item as any)[rowKey]}
        </Select.Option>
      ))}
    </Select>
  );
}

export default TableSelect;
