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

const handleImportStudents = data => {
  const workbook = XLSX.read(data, { type: 'binary' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

  const header = jsonData[0]
  const headerName = {
    'họ và tên': 'fullname',
    lớp: 'classes',
    trường: 'school',
    'tên đăng nhập': 'username',
    'mật khẩu': 'password'
  }
  const jsonArray = jsonData.slice(1).map(row => {
    const obj = {}
    header.forEach((col, index) => {
      const name = headerName[col?.toString()?.trim()?.toLocaleLowerCase()]
      if (name) {
        console.log(row[index], index)
        obj[name] = row[index]?.toString()?.trim()
      }
    })
    return obj
  })

  // Check thông tin
  const status = {
    total: jsonArray.length,
    empty: 0,
    double: 0
  }
  var checkUsername = {}
  const checkArray = jsonArray.filter(item => {
    if (!item?.fullname || !item?.username || !item?.password) {
      status.empty++
      return false
    }
    if (!checkUsername[item.username]) {
      checkUsername[item.username] = 1
      return true
    }
    status.double++
    return false
  })

  postMessage({ action: 'students', payload: { results: checkArray, status } })
}

self.onmessage = function (e) {
  const { action = '', payload = null } = e.data
  switch (action) {
    case 'excel':
      handleExportExcel(payload)
      break
    case 'students':
      handleImportStudents(payload)
      break
  }
}
