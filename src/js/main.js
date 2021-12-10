import 'virtual:windi.css'
import Cookies from 'js-cookie'
import { parse as QsParse } from 'qs'
import { useMobile, useCopy } from './hooks'
import {
  getToken,
  verifyToken,
  revokeToken,
  getTempToken,
  getBotUID,
} from './api'
import { toast, parseTime } from './share'
import debounce from 'debounce'

const element = {
  board: document.querySelector('#board'),
  submitButton: document.querySelector('#submit-button'),
  bottomText: document.querySelector('#bottom-text'),
  token: document.querySelector('#token'),
}

window.copy = useCopy(
  '#copy',
  '#token',
  () => {
    toast('复制成功', 'success')
  },
  () => {
    toast('复制失败,请手动复制', 'error')
  }
)

let botUid

const verify = debounce(async () => {
  const tokenCode = sessionStorage.getItem('token')
  const { data } = await verifyToken(tokenCode)
  if (data && data.code == 0) {
    Cookies.set('token', tokenCode, { expires: 1 })
    Cookies.set('time', new Date() * 1, { expires: 1 })
    toast('验证成功', 'success')
    setTimeout(() => {
      location.reload()
    }, 2500)
  } else {
    toast('验证失败，请稍后重试', 'error')
  }
}, 600)

const confirm = debounce(async () => {
  const redirect = async function () {
    const token = data.data.token
    window.location.href = params.redirect_uri + '#token=' + token
    throw 'stop exec' //中止代码继续执行
  }

  const params = getUrlParam()
  if (!params.redirect_uri) {
    toast('没有填写需要跳转的网址捏', 'error')
    return
  }

  const { data } = await getTempToken(Cookies.get('token'))

  if (!data || data.code != 0) {
    toast('获取授权码失败', 'error')
    return
  }

  toast('将为您自动跳转', 'success')
  setTimeout(redirect, 2500)
}, 600)

// 用于自动打开私聊窗口
// 移动端目前只能打开到个人信息页面
window.openChat = async function () {
  const mobileURL = `bilibili://space/${botUid}`
  const pcURL = `https://message.bilibili.com/#/whisper/mid${botUid}`
  const url = useMobile ? mobileURL : pcURL
  window.open(url)
}
/**
 * 获取url get参数
 * @return object get参数对象
 */
function getUrlParam() {
  return QsParse(window.location.search.substring(1))
}

async function flushToken() {
  const tokenCode = await getToken()
  // 前面加上 'AU' 用于标识授权操作
  // 在存 Cookie 的时候，只存 tokenCode
  element.token.innerText = 'AU' + tokenCode || ''
  sessionStorage.setItem('token', tokenCode)
}

window.flushToken = flushToken
window.isTokenValid = verifyToken

async function init() {
  botUid = await getBotUID()

  const removeCookie = () => {
    Cookies.remove('token')
    Cookies.remove('time')
  }

  const notLogin = async () => {
    await flushToken()
    element.submitButton.onclick = verify
  }

  const token = Cookies.get('token')
  if (!token) {
    await notLogin()
    return
  }
  const { data } = await verifyToken(token)
  if (data && data.code == 0) {
    const time = parseInt(Cookies.get('time')) + 86400000
    element.board.style.display = 'none'
    element.submitButton.innerText = '允许获取'
    element.submitButton.className += ' mt-4'
    element.submitButton.onclick = confirm
    element.bottomText.innerText = `用户 UID${
      data.uid
    }\n您已授权，授权后 24小时 内您无需再次认证,\n 授权过期时间 ${parseTime(
      time
    )}\n您也可以点击下方 红色按钮 手动取消授权`
    const revokeButton = document.createElement('button')
    revokeButton.onclick = debounce(async () => {
      const { data } = await revokeToken(token)
      if (data && data.code == 0) {
        toast('注销成功', 'success')
      } else {
        toast('当前未登录', 'error')
      }
      removeCookie()
      setTimeout(() => {
        location.reload()
      }, 2500)
    })

    revokeButton.innerText = '取消授权'
    revokeButton.className = 'btn bg-red-400 hover:bg-red-600'
    document.querySelector('#main-content').appendChild(revokeButton)
  } else {
    toast('登陆校验失败', 'error')
    removeCookie()
    await notLogin()
  }
}

init()
