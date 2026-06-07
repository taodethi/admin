// Trong worker.js
try {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js')
} catch (e) {
  try {
    importScripts('https://unpkg.com/pako@2.1.0/dist/pako.min.js')
  } catch (e2) {
    // Both CDNs failed – postMessage error when action fires
    self.pakoLoadError = 'Failed to load pako: ' + e2.message
  }
}

const decodeJSON = encodedData => {

  const decodedString = atob(encodedData)
  const decodedArray = new Uint8Array(decodedString.length)
  for (let i = 0; i < decodedString.length; i++) {
    decodedArray[i] = decodedString.charCodeAt(i)
  }
  const unzippedBuffer = pako.ungzip(decodedArray)
  return JSON.parse(new TextDecoder().decode(unzippedBuffer))
}

const removeAccents = inputString => {
  return inputString
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

const processQuestion = (item, question) => {
  let isTrue = false
  let point = question.point
  let options = []
  switch (question.type) {
    case 'TN':
      isTrue =
        item?.sorts.filter((it, ii) => question.options[it].keys && (item?.answers || []).includes(ii)).length === 1
      break
    case 'HK':
      isTrue =
        item?.sorts.filter(it => question?.options[it]?.keys).length ===
        item?.sorts.filter((it, ii) => question?.options[it]?.keys && (item?.answers || []).includes(ii)).length
      break
    case 'DT':
      isTrue =
        question?.options.filter(option => {
          var text = option.text
          var [answer = ''] = item?.answers || []
          if (question?.settings?.sign) {
            // Xóa dấu câu
            text = removeAccents(text)
            answer = removeAccents(answer)
          }
          if (question?.settings?.upper) {
            // Không phân biệt hoa thường
            text = text.toLowerCase()
            answer = answer.toLowerCase()
          }
          if (question?.settings?.space) {
            // Không phân biệt hoa thường
            text = text.replace(/\s/g, '')
            answer = answer.replace(/\s/g, '')
          }
          return text == answer
        }).length > 0
      break
    case 'TF':
      var len = item?.sorts.filter((it, ii) => {
        var option = question.options[it]
        return option.keys === (item?.answers || [])[ii]
      }).length
      point = [0, 0.1, 0.25, 0.5, 1][len] * question.point
      isTrue = len === question.options.length
      break
    default:
      break
  }

  if (!isTrue && question.type !== 'TF') point = 0

  // Hiển thị trạng thái của từng đáp án
  options = item?.sorts.map((it, ii) => {
    let user = ''
    let option = question.options[it]
    const answer = item?.answers || []

    switch (question.type) {
      case 'TN':
        if (answer[0] === ii) {
          user = 'error'
        }
        if (option.keys) {
          user = 'right'
          if (!answer.length) {
            user = 'none'
          }
        }
        break
      case 'HK':
        if (answer.includes(ii)) {
          user = 'error'
        }
        if (option.keys) {
          user = 'right'
          if (!answer.length) {
            user = 'none'
          }
        }
        break
      case 'DT':
        break
      case 'TF':
        user = ['', '']
        if (!answer[ii]) {
          // Không làm
          switch (option.keys) {
            case 'T':
              user[0] = 'none'

              break
            case 'F':
              user[1] = 'none'

              break
          }
        } else if (answer[ii] == option.keys) {
          // Đúng
          switch (option.keys) {
            case 'T':
              user[0] = 'right'

              break
            case 'F':
              user[1] = 'right'

              break
          }
        } else {
          // Sai
          switch (option.keys) {
            case 'T':
              user = ['right', 'error']

              break
            case 'F':
              user = ['error', 'right']

              break
          }
        }

        break
      default:
        break
    }

    return { ...option, user, postion: it }
  })

  if (question.type == 'DT') {
    options = question.options
  }

  return { isTrue, point, options }
}

const handleProcessLeaderboard = (data, realtime = false) => {
  let { response, results } = data
  const { settings, questions } = response
  // Phần đề thi
  const exams = { quizs: [], groups: [], questions: [], settings: { collects: [], students: [] } }

  questions.forEach(item => {
    if (item.quizs) {
      exams.quizs.push(decodeJSON(item.quizs))
    }
    if (item.groups) {
      exams.groups.push(decodeJSON(item.groups))
    }
    if (item.questions) {
      exams.questions.push(decodeJSON(item.questions))
    }
  })

  settings.forEach(item => {
    if (item.settings) {
      exams.settings = { ...exams.settings, ...decodeJSON(item.settings), url: item.url, postId: item.postId }
    }
    if (item.collects) {
      exams.settings.collects.push(decodeJSON(item.collects))
    }
    if (item.students) {
      exams.settings.students.push(decodeJSON(item.students))
    }
  })

  // Phần bài làm
  let questionMap = {}
  exams.questions.forEach(question => {
    questionMap[question.id] = question
  })

  let labels = {}

  let uniqueResults = {}

  let statistic = {
    total: 0,
    students: 0,
    points: 0,
    times: 0
  }

  let time = results.time
  results = results.results
    .map(result => {
      try {
        if (uniqueResults[result?.details?.ResultId]) return null
        uniqueResults[result?.details?.ResultId] = 1
        let details = decodeJSON(result?.details?.details)
        let securitys = decodeJSON(result?.securitys?.securitys)
        let logs = decodeJSON(result?.logs?.logs)
        let overview = {
          rank: 0,
          point: 0,
          right: 0,
          number: details.quizs?.[0]?.number ?? 1,
          retake: result?.details?.Retake,
          time: (securitys.submitAt ?? new Date().getTime()) - securitys.startAt,
          startAt: securitys.startAt,
          submitAt: securitys.submitAt,
          total: 0,
          link: exams?.settings?.url + '?id=' + result?.details?.ResultId,
          points: 0,
          student: getNameStudent({ ...result?.details, details }),
          hidden: securitys?.hidden?.length || 0,
          left: securitys?.left?.length || 0,
          menu: securitys?.right?.length || 0,
          offline: logs?.filter(it => it?.a == 'offline').length || 0,
          devices: securitys?.devices?.map(it => it.n) || [],
          ip: securitys?.ips?.map(it => it.n) || [],
          playMode: result?.details?.playMode || result?.playMode || 'standard'
        }

        if (result?.details?.Username) {
          var lab = {
            fullname: ' Họ và tên',
            classes: ' Lớp',
            school: ' Trường',
            username: ' Tên đăng nhập'
          }
          Object.keys(lab).forEach(it => {
            labels[lab[it]] = true
            overview[lab[it]] = result?.details?.Username[it]
          })
        }

        details?.collects?.forEach(it => {
          if (!labels[it.label]) labels[it.label] = true
          overview[it.label] = it?.value
        })

        details.questions.forEach((item, index) => {
          const question = questionMap[item.id]
          if (question) {
            let { isTrue, point, options } = processQuestion(item, question)
            if (isTrue) {
              overview.right++
            }
            overview.point += ['TL'].includes(question.type)
              ? parseFloat((details?.points || {})[question.id] || point)
              : parseFloat(point)
            overview.points += parseFloat(question.point)
            overview.total++
          }
        })

        statistic.total++
        statistic.points += overview.point
        statistic.times += isNaN(overview.time) ? 0 : overview.time
        return {
          ...result?.details,
          details,
          logs,
          securitys,
          overview
        }
      } catch (error) {
        console.log('Lỗi', error.message)
        return null
      }
    })
    .filter(it => it)

  self.postMessage({ action: 'fetchLeaderboard', payload: { exams, results, labels, time } })

  if (realtime) {
    let logs = []
    results.forEach(result => {
      logs = logs.concat(
        [
          ...result.logs,
          ...Object.keys(result.securitys).reduce((a, b) => {
            // if(['devices', 'ips', 'startAt', 'submitAt'].includes(b)) return (a = a.concat([]))
            if (b.includes('At')) return (a = a.concat([]))
            return (a = a.concat(result.securitys[b].map(it => ({ ...it, a: b }))))
          }, [])
        ].map(item => ({
          ...item,
          id: result.ResultId,
          student: getNameStudent(result),
          label: getFirstCharName(getNameStudent(result)),
          question: questionMap[item?.p?.id]
        }))
      )
      // logs = logs.concat(result.logs.map(item => ({ ...item, id: result.ResultId, student: getNameStudent(result) })))
    })

    self.postMessage({ action: 'logsRealtime', payload: processLogRealtime(logs) })
  }

  if (realtime) {
    const safeRtTotal = statistic.total || 1 // L14b: guard division by zero
    self.postMessage({
      action: 'statistic',
      payload: {
        ...statistic,
        points: parseFloat(statistic.points / safeRtTotal).toFixed(2),
        times: convertTime(parseInt(statistic.times / safeRtTotal))
      }
    })
  }

  //   self.postMessage({ action: 'response', payload: exams })
}

const countUniqueIds = (data, field = 'id') => {
  if (!data.some(item => item.hasOwnProperty(field))) {
    return 0
  }

  const uniqueIds = new Set(data.map(item => item[field]))
  return uniqueIds.size
}

const convertTime = milliseconds => {
  let hours = Math.floor(milliseconds / 3600000)
    .toString()
    .padStart(2, '0')
  milliseconds %= 3600000

  let minutes = Math.floor(milliseconds / 60000)
    .toString()
    .padStart(2, '0')
  milliseconds %= 60000

  let seconds = Math.floor(milliseconds / 1000)
    .toString()
    .padStart(2, '0')

  return hours + ':' + minutes + ':' + seconds
}

const getFirstCharName = name => {
  try {
    return name
      .split(' ')
      .map(it => it.substr(0, 1))
      .filter(it => it)
      .map(it => it.toLocaleUpperCase())
      .join('')
      .substr(-3)
  } catch (err) {
    return ''
  }
}

const escapeHTML = str => String(str || '').replace(/[&<>'"]/g, match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[match]));

const getNameStudent = results => {
  try {
    if (results?.Username) {
      return escapeHTML(results?.Username?.fullname || results?.Username?.username || '')
    }

    if (results?.details?.collects?.length) {
      return escapeHTML(results?.details?.collects.find(it => /tên|name/i.test(it.label))?.value || '')
    }

    return escapeHTML(results.ResultId || '')
  } catch (err) {
    console.log('getNameStudent', err.message)
    return ''
  }
}

const handleViewDetails = data => {
  const { id, leaderboard } = data
  // L10: O(1) Map lookup instead of O(N) find
  const resultMap = new Map(leaderboard.results.map(r => [r.ResultId, r]))
  let results = resultMap.get(id)
  if (!results) return
  const questionMap = new Map(leaderboard.exams.questions.map(q => [q.id, q]))

  let payload = {
    overview: results.overview,
    details: {
      ...results.details,
      questions: results.details.questions.map((item, index) => {
        var question = questionMap.get(item.id)
        if (!question) return { ...item }
        let { isTrue, point, options } = processQuestion(item, question)
        var group = results.details.groups.find(it => it.id == question.groupId)
        return {
          ...question,
          isTrue,
          point,
          options,
          answers: item?.answers,
          numberUser: group?.order ? group.questions.findIndex(it => it == item.id) + 1 : index + 1,
          teacher: ['TL'].includes(question.type)
            ? parseFloat((results.details?.points || {})[question.id] || point)
            : undefined,
          maxPoint: question?.type == 'TL' ? question.point : undefined
        }
      })
    },
    id,
    student: getNameStudent(results),
    Username: results.Username
  }
  self.postMessage({ action: 'viewDetails', payload })
}

const handleBulkDetails = data => {
  const { selectedIds, leaderboard } = data
  const resultMap = new Map(leaderboard.results.map(r => [r.ResultId, r]))
  const questionMap = new Map(leaderboard.exams.questions.map(q => [q.id, q]))

  const payload = selectedIds.map(id => {
    let results = resultMap.get(id)
    if (!results) return null

    return {
      overview: results.overview,
      details: {
        ...results.details,
        questions: results.details.questions.map((item, index) => {
          var question = questionMap.get(item.id)
          if (!question) return { ...item }
          let { isTrue, point, options } = processQuestion(item, question)
          var group = results.details.groups.find(it => it.id == question.groupId)
          return {
            ...question,
            isTrue,
            point,
            options,
            answers: item?.answers,
            numberUser: group?.order ? group.questions.findIndex(it => it == item.id) + 1 : index + 1,
            teacher: ['TL'].includes(question.type)
              ? parseFloat((results.details?.points || {})[question.id] || point)
              : undefined,
            maxPoint: question?.type == 'TL' ? question.point : undefined
          }
        })
      },
      id,
      student: getNameStudent(results),
      Username: results.Username
    }
  }).filter(Boolean)

  self.postMessage({ action: 'bulkDetailsResult', payload })
}

const handleHistoryDetails = data => {
  const { id, leaderboard } = data
  // L10: O(1) Map lookup instead of O(N) find
  const resultMap = new Map(leaderboard.results.map(r => [r.ResultId, r]))
  let results = resultMap.get(id)
  if (!results) return
  const questionMap = new Map(leaderboard.exams.questions.map(q => [q.id, q]))

  let logs = [
    ...results.logs,
    ...Object.keys(results.securitys).reduce((a, b) => {
      // if(['devices', 'ips', 'startAt', 'submitAt'].includes(b)) return (a = a.concat([]))
      if (b.includes('At')) return (a = a.concat([]))
      return (a = a.concat(results.securitys[b].map(it => ({ ...it, a: b }))))
    }, [])
  ].map(item => ({
    ...item,
    id: results.ResultId,
    student: getNameStudent(results),
    label: getFirstCharName(getNameStudent(results)),
    question: item?.p?.id ? questionMap.get(item.p.id) : undefined
  }))

  self.postMessage({
    action: 'historyDetails',
    payload: { id, student: getNameStudent(results), logs: processLogRealtime(logs) }
  })
}

const processLogRealtime = logs => {
  const getText = item => {
    const sName = item.student ? `Bạn <b style="color:red">${item.student}</b> đã ` : 'Đã '

    switch (item.a) {
      case 'devices':
        return `${sName}truy cập bằng <b style="color:green">${item.n}</b>.`
      case 'ips':
        return `${sName}truy cập địa chỉ IP <b style="color:green">${item.n}</b>.`

      case 'left':
        return `${sName}nhấn chuột trái.`
      case 'right':
        return `${sName}nhấn chuột phải.`
      case 'shortcut':
        return `${sName}sử dụng phím tắt.`
      case 'hidden':
        return `${sName}thoát khỏi màn hình làm bài.`
      case 'visible':
        return `${sName}quay trở lại màn hình làm bài.`

      case 'submit':
        const textSubmit = s => {
          switch (s) {
            case 'teacher':
              return 'GV buộc dừng'
            case 'user':
              return 'HS tự nộp'
            case 'autotimeout':
            case 'timeout':
              return 'Hết giờ'
            case 'tabs':
              return 'Chuyển tabs'
          }
          return 'Chưa xác định'
        }
        return `${sName}nộp bài thi <b style="color:green">(${textSubmit(
          item?.p?.s
        )})</b>.`
      case 'start':
        return `${sName}bắt đầu làm bài thi.`
      case 'online':
        return `${sName}kết nối mạng trở lại (online).`
      case 'offline':
        return `${sName}ngắt kết nối mạng (offline)`

      case 'answers':
        if (!item?.question) return `${sName}trả lời câu hỏi`

        let qNum = item?.p?.n !== undefined ? item.p.n : (item?.question?.numberUser || item?.question?.number || '?')
        let qGroupText = (item?.p?.g !== undefined) ? ` phần ${item?.p?.g + 1}` : ''

        let textResult = ''
        if (item?.question?.type === 'TN' || item?.question?.type === 'HK') {
          if (item?.p?.answers && Array.isArray(item.p.answers)) {
            textResult = item.p.answers.map(val => String.fromCharCode(65 + parseInt(val))).join(', ')
          } else if (item?.p?.v !== undefined) {
            textResult = String.fromCharCode(65 + parseInt(item?.p?.v))
          }
          return `${sName}trả lời câu ${qNum}${qGroupText} chọn <b style="color:green">"${textResult}"</b>`
        }
        else if (item?.question?.type === 'DT' || item?.question?.type === 'TL') {
          textResult = item?.p?.answers ? item.p.answers[0] : item?.p?.v
          return `${sName}trả lời câu ${qNum}${qGroupText} với nội dung <b style="color:green">"${textResult || ''}"</b>`
        }
        else if (item?.question?.type === 'TF') {
          let partTF = item?.p?.p !== undefined ? ` ý ${String.fromCharCode(97 + parseInt(item.p.p))}` : ''
          textResult = item?.p?.answers ? item.p.answers[0] : item?.p?.v
          let tfResult = textResult == 'T' ? 'Đúng' : (textResult == 'F' ? 'Sai' : textResult)
          return `${sName}trả lời câu ${qNum}${qGroupText}${partTF} chọn <b style="color:green">"${tfResult}"</b>`
        }
        return `${sName}trả lời câu ${qNum}${qGroupText} chọn `
    }
    return ''
  }

  return logs
    .sort((a, b) => a.t - b.t)
    .filter(item => !['left', 'right', 'shortcut'].includes(item.a))
    .map(item => {
      return {
        label: item.label,
        t: item.t,
        id: item.id,
        item,
        text: getText(item)
      }
    })
}

const handleCurrentRealtime = data => {
  let { currents, exams, results, time } = data

  results = results.concat(currents || [])

  let { results: newResults, labels, statistic, logs, doing } = processLeaderboard({ exams, results })

  self.postMessage({ action: 'updateRealtime', payload: { results: newResults, labels, time } })

  self.postMessage({ action: 'statistic', payload: statistic })

  self.postMessage({ action: 'logsRealtime', payload: logs })

  self.postMessage({ action: 'studentsRealtime', payload: doing })
}

const processLeaderboard = ({ exams, results }) => {
  // Phần bài làm
  let questionMap = {}
  let labels = {}
  let uniqueResults = {}
  let statistic = {
    total: 0,
    students: 0,
    points: 0,
    times: 0
  }

  exams.questions.forEach(question => {
    questionMap[question.id] = question
  })

  let newResults = results
    .map(result => {
      try {
        if (uniqueResults[result?.ResultId]) return null
        uniqueResults[result?.ResultId] = 1

        let { details, securitys, logs } = result
        let overview = {
          rank: 0,
          point: 0,
          right: 0,
          number: details?.quizs?.[0]?.number ?? 1,
          retake: result?.Retake,
          time: (securitys.submitAt ?? new Date().getTime()) - securitys.startAt,
          startAt: securitys.startAt,
          submitAt: securitys.submitAt,
          total: 0,
          link: (exams?.settings?.url || '') + '?id=' + result?.ResultId,
          points: 0,
          hidden: securitys?.hidden?.length || 0,
          left: securitys?.left?.length || 0,
          menu: securitys?.right?.length || 0,
          offline: logs?.filter(it => it?.a == 'offline').length || 0,
          devices: securitys?.devices?.map(it => it.n) || [],
          ip: securitys?.ips?.map(it => it.n) || [],
          student: getNameStudent(result), // L9: fixed – was hardcoded 'hi'
          playMode: result?.playMode || result?.details?.playMode || 'standard'
        }

        if (result?.Username) {
          var lab = {
            fullname: ' Họ và tên',
            classes: ' Lớp',
            school: ' Trường',
            username: ' Tên đăng nhập'
          }
          Object.keys(lab).forEach(it => {
            labels[lab[it]] = true
            overview[lab[it]] = result?.Username[it]
          })
        }

        details?.collects?.forEach(it => {
          if (!labels[it.label]) labels[it.label] = true
          overview[it.label] = it.value
        })

        details.questions.forEach((item, index) => {
          const question = questionMap[item.id]
          if (question) {
            let { isTrue, point } = processQuestion(item, question)
            if (isTrue) {
              overview.right++
            }
            overview.point += ['TL'].includes(question.type)
              ? parseFloat((details?.points || {})[question.id] || point)
              : parseFloat(point)
            overview.points += parseFloat(question.point)
            overview.total++
          }
        })

        statistic.total++
        statistic.points += overview.point
        statistic.times += isNaN(overview.time) ? 0 : overview.time
        return {
          ...result,
          details,
          logs: result?.logs,
          securitys,
          overview
        }
      } catch (error) {
        console.log('', error.message)
        return null
      }
    })
    .filter(it => it)
  let logs = []
  newResults.forEach(result => {
    logs = logs.concat(
      [
        ...result.logs,
        ...Object.keys(result.securitys).reduce((a, b) => {
          // if(['devices', 'ips', 'startAt', 'submitAt'].includes(b)) return (a = a.concat([]))
          if (b.includes('At')) return (a = a.concat([]))
          return (a = a.concat(result.securitys[b].map(it => ({ ...it, a: b }))))
        }, [])
      ].map(item => ({
        ...item,
        id: result.ResultId,
        student: getNameStudent(result),
        label: getFirstCharName(getNameStudent(result)),
        question: questionMap[item?.p?.id]
      }))
    )
  })

  let doing = newResults
    .filter(item => !item?.securitys?.submitAt)
    .map(item => ({
      color: item?.status == 'online' ? 'success' : item?.status == 'offline' ? 'error' : 'warning',
      id: item.ResultId,
      student: getNameStudent(item),
      label: getFirstCharName(getNameStudent(item)),
      clientId: item.ClientId,
      userToken: item.UserToken,
      status: item.status,
      startAt: item?.securitys?.startAt,
      taked: `${item?.details?.questions
        ?.filter(it => it?.answers?.length)
        ?.length?.toString()
        ?.padStart(2, '0')}/${item?.details?.questions?.length?.toString()?.padStart(2, '0')}`
    }))

  const safeStatTotal = statistic.total || 1 // L14: guard division by zero
  return {
    results: newResults,
    labels,
    statistic: {
      ...statistic,
      points: parseFloat(statistic.points / safeStatTotal).toFixed(2),
      times: convertTime(parseInt(statistic.times / safeStatTotal))
    },
    logs: processLogRealtime(logs),
    doing
  }
}

// L5: Optimized – status-only changes (online/offline/hidden) don't need full processLeaderboard
const handleUpdateLogsRealtime = data => {
  let { logs, exams, results } = data

  // L5: Only update status on the affected result – O(N) but no processQuestion
  const newResults = results.map(result => {
    if (result?.ResultId !== logs?.ResultId) return result
    return {
      ...result,
      ClientId: logs.action === 'online' ? (logs?.payload?.ClientId || result.ClientId) : result.ClientId,
      securitys: {
        ...result.securitys,
        [logs.action]: [...(result.securitys[logs.action] || []), { t: logs.time }]
      },
      status: logs.action
    }
  })

  // L5: Rebuild doing cheaply – no question processing needed
  const doing = newResults
    .filter(r => !r?.securitys?.submitAt)
    .map(r => ({
      id: r.ResultId,
      student: getNameStudent(r),
      label: getFirstCharName(getNameStudent(r)),
      clientId: r.ClientId,
      userToken: r.UserToken,
      status: r.status,
      startAt: r?.securitys?.startAt,
      taked: r?.overview?.taked || 0,
      total: r?.overview?.total || 0,
      color: r.status === 'online' ? 'success' : r.status === 'offline' ? 'error' : 'warning'
    }))

  self.postMessage({ action: 'updateRealtime', payload: { results: newResults } })
  self.postMessage({ action: 'studentsRealtime', payload: doing })
}
// L4: Targeted reprocessing – only recalculate the ONE affected result
// vs processLeaderboard() which recalculates ALL results (N * Q operations)
const reprocessSingleResult = (result, exams, questionMap) => {
  try {
    const { details, securitys, logs } = result
    if (!details || !Array.isArray(details.questions)) return result
    const logsSafe = Array.isArray(logs) ? logs : []
    const secSafe = (securitys && typeof securitys === 'object') ? securitys : {}
    let overview = {
      rank: 0, point: 0, right: 0, taked: 0,
      number: details.quizs?.[0]?.number ?? 1,
      retake: result.Retake,
      time: (secSafe.submitAt ?? new Date().getTime()) - (secSafe.startAt || 0),
      startAt: secSafe.startAt || 0,
      submitAt: secSafe.submitAt || null,
      total: 0, points: 0,
      link: (exams?.settings?.url || '') + '?id=' + result.ResultId,
      student: getNameStudent(result),
      hidden: secSafe?.hidden?.length || 0,
      left: secSafe?.left?.length || 0,
      menu: secSafe?.right?.length || 0,
      offline: logsSafe.filter(it => it?.a === 'offline').length,
      devices: (secSafe?.devices || []).map(it => it?.n).filter(Boolean),
      ip: (secSafe?.ips || []).map(it => it?.n).filter(Boolean),
      playMode: result.playMode || result.details?.playMode || 'standard'
    }
    overview.label = getFirstCharName(overview.student)
    if (result.Username) {
      const lab = { fullname: ' Họ và tên', classes: ' Lớp', school: ' Trường', username: ' Tên đăng nhập' }
      Object.keys(lab).forEach(it => { overview[lab[it]] = result.Username?.[it] ?? '' })
    }
    details?.collects?.forEach(it => { if (it?.label) overview[it.label] = it.value ?? '' })
    details.questions.forEach(item => {
      if (!item?.id) return
      const question = questionMap instanceof Map ? questionMap.get(item.id) : questionMap[item.id]
      if (!question) return
      const { isTrue, point } = processQuestion(item, question)
      if (isTrue) overview.right++
      overview.point += ['TL'].includes(question.type)
        ? parseFloat((details?.points || {})[question.id] || point) || 0
        : parseFloat(point) || 0
      overview.points += parseFloat(question.point) || 0
      overview.total++
      if (item?.answers?.length && !item.answers.includes(-1)) overview.taked++
    })
    return { ...result, overview }
  } catch (err) {
    console.log('reprocessSingleResult', err.message, result?.ResultId)
    return result
  }
}

// L4: Optimized – only reprocess the affected result row
const handleUpdateEventsRealtime = data => {
  let { events, exams, results } = data

  // L4: Build questionMap ONCE - O(Q) instead of O(N*Q)
  const questionMap = new Map()
  exams.questions.forEach(q => { if (q?.id) questionMap.set(q.id, q) })

  const targetIdx = results.findIndex(r => r?.ResultId === events?.ResultId)
  let newResults = results

  if (events?.action === "answers" && targetIdx >= 0) {
    const result = results[targetIdx]
    const updated = {
      ...result,
      details: {
        ...result.details,
        questions: result.details.questions.map(q =>
          q.id == events?.payload?.id ? { ...q, answers: events?.payload?.answers } : q
        )
      },
      logs: [...(result.logs || []), { a: "answers", p: events?.payload, t: events.time }],
      status: "online"
    }
    newResults = [...results]
    newResults[targetIdx] = reprocessSingleResult(updated, exams, questionMap)
  }
  else if (events?.action === "submit" && targetIdx >= 0) {
    const result = results[targetIdx]
    const updated = {
      ...result,
      securitys: { ...result.securitys, submitAt: events?.time },
      logs: [...(result.logs || []), { a: "submit", p: events?.payload, t: events?.time }],
      status: "submit"
    }
    newResults = [...results]
    newResults[targetIdx] = reprocessSingleResult(updated, exams, questionMap)
  }
  else if (events?.action === "start" && events?.payload) {
    const newResult = reprocessSingleResult(events.payload, exams, questionMap)
    newResults = [...results, newResult]
  }

  let labels = {}
  newResults.forEach(r => {
    if (r?.Username) {
      const lab = { fullname: " Ho va ten", classes: " Lop", school: " Truong", username: " Ten dang nhap" }
      Object.keys(lab).forEach(it => { labels[lab[it]] = true })
    }
    r?.details?.collects?.forEach(it => { if (it?.label) labels[it.label] = true })
  })

  let stTotal = 0, stPoints = 0, stTimes = 0
  newResults.forEach(r => {
    stTotal++
    stPoints += parseFloat(r.overview?.point || 0)
    stTimes += isNaN(r.overview?.time) ? 0 : (r.overview?.time || 0)
  })
  const safeST = stTotal || 1
  const statistic = {
    total: stTotal,
    points: parseFloat(stPoints / safeST).toFixed(2),
    times: convertTime(parseInt(stTimes / safeST))
  }

  const doing = newResults
    .filter(r => !r?.securitys?.submitAt)
    .map(r => ({
      id: r.ResultId,
      student: getNameStudent(r),
      label: getFirstCharName(getNameStudent(r)),
      clientId: r.ClientId,
      userToken: r.UserToken,
      status: r.status,
      startAt: r?.securitys?.startAt,
      taked: r?.overview?.taked || 0,
      total: r?.overview?.total || 0,
      color: r.status === "online" ? "success" : r.status === "offline" ? "error" : "warning"
    }))

  self.postMessage({ action: "updateRealtime", payload: { results: newResults, labels } })
  self.postMessage({ action: "statistic", payload: statistic })
  self.postMessage({ action: "studentsRealtime", payload: doing })
}

const handleFetchCreate = data => {
  const { settings, questions, share = false, results } = data
  let exams = { quizs: [], groups: [], questions: [], settings: { collects: [], students: [], title: '' } }

  questions.forEach(item => {
    if (item.quizs) {
      exams.quizs.push(decodeJSON(item.quizs))
    }

    if (item.groups) {
      exams.groups.push(decodeJSON(item.groups))
    }
    if (item.questions) {
      exams.questions.push(decodeJSON(item.questions))
    }
  })

  settings.forEach(item => {
    if (item.settings) {
      exams.settings = {
        ...exams.settings,
        ...decodeJSON(item.settings),
        url: item.url,
        postId: item.postId,
        id: results?.id ?? ''
      }
    }
    if (item.collects) {
      exams.settings.collects.push(decodeJSON(item.collects))
    }
    if (item.students) {
      exams.settings.students.push(decodeJSON(item.students))
    }
  })

  if (share) {
    exams.settings.id = share
  }
  self.postMessage({ action: 'fetchCreate', payload: exams })
}

const handleCheckErrorCreate = examsCurrent => {
  const { settings, quizs, groups, questions } = examsCurrent
  const results = { errors: [], warnings: [] }

  const isEmptyContent = htmlStr => {
    if (!htmlStr) return true;
    if (typeof htmlStr !== 'string') htmlStr = String(htmlStr);
    const clean = htmlStr.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, '').trim();
    if (!clean && !htmlStr.includes('<img') && !htmlStr.includes('<iframe') && !htmlStr.includes('<audio') && !htmlStr.includes('<video')) {
      return true;
    }
    return false;
  }

  // Thông tin trong settings
  if (!settings.title.trim()) results.errors.push({ id: '', text: 'Tên đề thi không được để trống 😓' })
  if (settings?.title?.trim()?.length < 10)
    results.errors.push({ id: '', text: 'Tên đề thi tối thiểu phải có 10 ký tự 😓' })

  switch (settings.accept) {
    case 'all':
      !settings?.collects.length &&
        results.errors.push({ id: '', text: 'Thông tin cần thu thập tối thiểu phải có 1 thông tin 😓' })
      break
    case 'classes':
      !settings?.students.length && results.errors.push({ id: '', text: 'Vui lòng chọn lớp cần giao bài 😓' })
      break
    case 'student':
      !settings?.students.length && results.errors.push({ id: '', text: 'Vui lòng chọn học sinh cần giao bài 😓' })
      break
    case 'list':
      !settings?.students.length &&
        results.errors.push({ id: '', text: 'Vui lòng thêm tài khoản học sinh giao bài 😓' })
      break
    default:
      !settings?.collects.length &&
        results.errors.push({ id: '', text: 'Thông tin cần thu thập tối thiểu phải có 1 thông tin 😓' })
      break
  }

  // Thông tin đề thi
  quizs.forEach(quiz => {
    if (!quiz.groups.length) {
      results.errors.push({ text: `Đề số ${quiz.number} chưa có câu hỏi nào 😓`, id: quiz.id })
    } else {
      var number = 1
      quiz.groups.forEach((groupId, indexGroup) => {
        const group = groups.find(item => item.id === groupId)
        if (group) {
          if (!group.questions.length) {
            results.errors.push({
              text: `Nhóm ${indexGroup + 1} của Đề số ${quiz.number} chưa có câu hỏi nào 😓`,
              id: group.id
            })
          } else {
            quiz.groups.length > 1 &&
              isEmptyContent(group.content) &&
              results.warnings.push(`Nội dung của Nhóm ${indexGroup + 1} Đề số ${quiz.number} đang trống`)
            var numberInGroup = 1
            group.questions.forEach((questionId, indexQuestion) => {
              const question = questions.find(item => item.id === questionId)
              if (question) {
                if (group?.order) {
                  if (numberInGroup != question.number)
                    results.warnings.push(
                      `Câu ${question.number} Nhóm ${indexGroup + 1} của Đề số ${quiz.number} không đánh đúng số thứ tự`
                    )
                } else {
                  if (number != question.number)
                    results.warnings.push(
                      `Câu ${question.number} Nhóm ${indexGroup + 1}  của Đề số ${quiz.number
                      } không đánh đúng số thứ tự`
                    )
                }

                isEmptyContent(question.content) &&
                  results.warnings.push(
                    `Nội dung Câu ${question.number} Nhóm ${indexGroup + 1}  Đề số ${quiz.number} đang rỗng`
                  )

                !parseFloat(question.point) &&
                  results.warnings.push(
                    `Câu ${question.number} Nhóm ${indexGroup + 1}  Đề số ${quiz.number} chưa có điểm`
                  )

                if ('TN-MN-DT-HK'.includes(question?.type)) {
                  !(question.options || []).length &&
                    results.errors.push({
                      text: `Câu ${question.number} Nhóm ${indexGroup + 1}  Đề số ${quiz.number} chưa có đáp án 😓`,
                      id: question.id
                    })

                  if ((question.options || []).length) {
                    var findEmpty = (question.options || []).findIndex(item => isEmptyContent(item.text))
                    if (findEmpty >= 0)
                      results.errors.push({
                        id: question.id,
                        text: `Đáp án ${question?.type === 'DT' ? (findEmpty + 1) : String.fromCharCode(65 + findEmpty)} Câu ${question.number} Nhóm ${indexGroup + 1
                          } Đề số ${quiz.number} đang rỗng 😓`
                      })
                  }
                }

                // Phần đáp án đúng
                switch (question?.type) {
                  case 'TN':
                    if ((question?.options || []).filter(it => it.keys).length !== 1) {
                      results.errors.push({
                        id: question.id,
                        text: `Câu ${number}  Nhóm ${indexGroup + 1} Đề số ${quiz.number} chưa chọn đáp án đúng 😓`
                      })
                    }
                    break
                  case 'HK':
                    if (!(question?.options || []).filter(it => it.keys).length) {
                      results.errors.push({
                        id: question.id,
                        text: `Câu ${number}  Nhóm ${indexGroup + 1} Đề số ${quiz.number} chưa chọn đáp án đúng 😓`
                      })
                    }
                    break
                  case 'TF':
                    var lp = (question?.options || []).filter(it => ['T', 'F'].includes(it.keys)).length
                    if (lp !== (question?.options || []).length) {
                      results.errors.push({
                        id: question.id,
                        text: `Câu ${number}  Nhóm ${indexGroup + 1} Đề số ${quiz.number} chưa chọn đáp án đúng 😓`
                      })
                    }
                    break
                }

                number++
                numberInGroup++
              }
            })
          }
        }
      })
    }
  })

  self.postMessage({ action: 'checkErrorCreate', payload: results })
}

const handleUpdateResult = data => {
  // try {
  let {
    results: resultUpdate,
    leaderboard: { exams, results }
  } = data

  let questionMap = {}
  exams.questions.forEach(question => {
    questionMap[question.id] = question
  })

  let results_ = results.map(result => {
    if (result.ResultId == resultUpdate.id) {
      let details = decodeJSON(resultUpdate?.details?.details)
      let securitys = decodeJSON(resultUpdate?.securitys?.securitys)
      let logs = decodeJSON(resultUpdate?.logs?.logs)
      let overview = {
        rank: 0,
        point: 0,
        right: 0,
        number: details?.quizs?.[0]?.number ?? 1,
        retake: resultUpdate?.details?.Retake,
        time: (securitys.submitAt ?? new Date().getTime()) - securitys.startAt,
        startAt: securitys.startAt,
        submitAt: securitys.submitAt,
        total: 0,
        link: exams?.settings?.url + '?id=' + resultUpdate?.details?.ResultId,
        points: 0,
        student: getNameStudent({ ...resultUpdate?.details, details }),
        hidden: securitys?.hidden?.length || 0,
        left: securitys?.left?.length || 0,
        menu: securitys?.right?.length || 0,
        offline: logs?.filter(it => it?.a == 'offline').length || 0,
        devices: securitys?.devices?.map(it => it.n) || [],
        ip: securitys?.ips?.map(it => it.n) || [],
        student: getNameStudent({ ...resultUpdate?.details, details }) // L9b: fixed 'Hi'
      }

      if (resultUpdate?.Username) {
        var lab = {
          fullname: ' Họ và tên',
          classes: ' Lớp',
          school: ' Trường',
          username: ' Tên đăng nhập'
        }
        var labels = {} // L9b: labels was undefined in this scope
        Object.keys(lab).forEach(it => {
          labels[lab[it]] = true
          overview[lab[it]] = resultUpdate?.Username[it]
        })
      }

      details?.collects?.forEach(it => {
        overview[it.label] = it.value
      })

      details.questions.forEach((item, index) => {
        const question = questionMap[item.id]
        if (question) {
          let { isTrue, point, options } = processQuestion(item, question)
          if (isTrue) {
            overview.right++
          }
          overview.point += ['TL'].includes(question.type)
            ? parseFloat((details?.points || {})[question.id] || point)
            : parseFloat(point)
          overview.points += parseFloat(question.point)
          overview.total++
        }
      })

      return {
        ...resultUpdate?.details,
        details,
        logs,
        securitys,
        overview
      }
    }
    return result
  })

  let { results: newResults, labels } = processLeaderboard({ exams, results: results_ })

  self.postMessage({ action: 'updateRealtime', payload: { results: newResults, labels, time: resultUpdate.time } })
  // } catch (error) {
  //   console.log('handleUpdateResult', error.message)
  // }
}

// Lắng nghe sự kiện postMessage từ main thread
self.onmessage = function (e) {
  const { action = '', payload = null } = e.data

  switch (action) {
    case 'fetchLeaderboard':
      handleProcessLeaderboard(payload)
      break
    case 'fetchRealtime':
      handleProcessLeaderboard(payload, true)
      break
    case 'viewDetails':
      handleViewDetails(payload)
      break
    case 'bulkDetails':
      handleBulkDetails(payload)
      break
    case 'historyDetails':
      handleHistoryDetails(payload)
      break
    case 'currentRealtime':
      handleCurrentRealtime(payload)
      break
    case 'logsRealtime':
      handleUpdateLogsRealtime(payload)
      break
    case 'eventsRealtime':
      handleUpdateEventsRealtime(payload)
      break
    case 'fetchCreate':
      handleFetchCreate(payload)
      break
    case 'checkErrorCreate':
      handleCheckErrorCreate(payload)
      break
    case 'updateResult':
      handleUpdateResult(payload)
      break
  }
}
