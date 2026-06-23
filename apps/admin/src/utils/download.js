/**
 * 下载文件工具
 */
export const downloadByBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
export const downloadByUrl = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export const downloadFile = (data, filename) => {
    const blob = new Blob([data]);
    downloadByBlob(blob, filename);
};
//# sourceMappingURL=download.js.map