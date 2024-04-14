importScripts('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')

const handleExportExcel = ({ results }) => {
  try {
    // Chuyển đổi JSON sang dạng dữ liệu Excel (Workbook)
    const workbook = XLSX.utils.book_new()
    const sheet = XLSX.utils.json_to_sheet(results)
    XLSX.utils.book_append_sheet(workbook, sheet, 'DATA')


    // Chuyển đổi Workbook sang ArrayBuffer (định dạng dữ liệu Excel)
    const excelData = XLSX.write(workbook, { type: 'buffer' })

    // Gửi dữ liệu Excel về cho main.js
    postMessage({ action: 'excel', payload: excelData })
  } catch (error) {
    // Nếu có lỗi, gửi thông báo lỗi về cho main.js
    postMessage({ error: error.message })
  }
}
self.onmessage = function (e) {
  const { action = '', payload = null } = e.data
  switch (action) {
    case 'excel':
      handleExportExcel(payload)
      break
  }
}
