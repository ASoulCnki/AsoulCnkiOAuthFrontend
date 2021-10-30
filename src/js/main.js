import 'virtual:windi.css'
import Cookies from 'js-cookie'
import { parse as QsParse } from 'qs'
import { useMobile } from './hooks'
import { getToken, verifyToken } from './api'

const element = {
  board: document.querySelector('#board'),
  submitButton: document.querySelector('#submit-button'),
  bottomText: document.querySelector('#bottom-text'),
  token: document.querySelector('#token'),
}

window.onButtonClick = async function () {
  if (await isTokenValid(sessionStorage.getItem('token'))) {
    Cookies.set('token', tokenCode, { expires: 1 })
    redirect()
  } else {
    alert('Token验证失败')
  }
}

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
// 判断cookie中token是否仍有效
;(async () => {
  const token = Cookies.get('token')

  if (token && (await verifyToken(token))) {
    element.board.style.display = 'none'
    element.submitButton.value = '允许获取'
    element.submitButton.className += ' mt-4'
    element.bottomText.innerText = '授权后24小时内您无需再次认证'
  } else {
    const tokenCode = await getToken()
    element.token.innerText = tokenCode || ''
    sessionStorage.setItem('token', tokenCode)
  }
})()
