import 'virtual:windi.css'
import Cookies from 'js-cookie'
import { parse as QsParse } from 'qs'
import { useMobile, useCopy } from './hooks'
import { getToken, verifyToken, revokeToken } from './api'
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

window.onButtonClick = debounce(async () => {
  const tokenCode = sessionStorage.getItem('token')
  const { isAuthed } = await verifyToken(tokenCode)
  if (isAuthed) {
    Cookies.set('token', tokenCode, { expires: 1 })
    toast('验证成功', 'success')
    redirect()
  } else {
    toast('验证失败，token已刷新，请重试', 'error')
    await flushToken()
  }
}, 600)

// 用于自动打开私聊窗口
// 移动端目前只能打开到个人信息页面
window.openChat = function () {
  const botUid = '307268720'
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

window.redirect = function () {
  const token = Cookies.get('token')
  const urlParams = getUrlParam()
  if (!urlParams.redirect_uri) {
    return
  }

  window.location.href = urlParams.redirect_uri + '#token=' + token
  throw 'stop exec' //中止代码继续执行
}
window.isTokenValid = verifyToken

async function init() {
  const token = Cookies.get('token')
  const { isAuthed, nickname, uid, createTs } = await verifyToken(token)
  if (token && isAuthed) {
    element.board.style.display = 'none'
    element.submitButton.innerText = '允许获取'
    element.submitButton.className += ' mt-4'
    element.bottomText.innerText = `${nickname}(${uid})\n您已授权，授权后 24小时 内您无需再次认证\n授权时间:${parseTime(
      createTs
    )}`
    const revokeButton = document.createElement('button')
    revokeButton.onclick = () => {
      revokeToken(token, uid)
      Cookies.remove('token')
    }
    revokeButton.innerText = '取消授权'
    revokeButton.className = 'btn bg-red-400'
    document.querySelector('#main-content').appendChild(revokeButton)
  } else {
    await flushToken()
  }
}

init()
