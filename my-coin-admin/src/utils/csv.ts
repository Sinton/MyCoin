/**
 * 将数据导出为 CSV 文件并触发浏览器下载
 * @param data 数据数组
 * @param fileName 文件名（不需要后缀）
 * @param headers 列头映射 { key: label }
 */
export const exportToCSV = (
  data: any[], 
  fileName: string, 
  headers: Record<string, string>
) => {
  if (!data || data.length === 0) return;

  // 1. 提取表头
  const headerKeys = Object.keys(headers);
  const headerLabels = Object.values(headers);

  // 2. 组装 CSV 内容
  const csvRows = [];
  
  // 写入表头
  csvRows.push(headerLabels.join(','));

  // 写入数据行
  for (const row of data) {
    const values = headerKeys.map(key => {
      let val = row[key];
      
      // 处理特殊字符和逗号
      if (val === null || val === undefined) val = '';
      val = String(val).replace(/"/g, '""'); // 转义引号
      
      return `"${val}"`; // 包裹引号以防逗号截断
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');

  // 3. 创建 Blob 并处理中文乱码 (添加 BOM 头)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8;' });
  
  // 4. 触发下载
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
