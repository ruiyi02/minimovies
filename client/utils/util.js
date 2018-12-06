//use moment.js for date format
  const moment = require("moment-with-locales.min.js")

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumberTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  return [year, month, day].map(formatNumber).join('/')
}

const fromNowDate = date => {
  return moment(date).locale('zh_cn').fromNow()
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatSeconds = (s) => {
  let str = ""
  if (s > 0) {
    const minutes = Math.floor(s / 60);
    const seconds = Math.floor(s - minutes * 60);
    let m_str = minutes < 10 ? "0" + minutes : minutes;
    let s_str = seconds < 10 ? "0" + seconds : seconds;
    str = m_str + ":" + s_str;
  }
  return str;
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

module.exports = { formatTime, formatNumberTime, formatDate, fromNowDate, formatSeconds, showBusy, showSuccess, showModel }
