import clipboard from 'clipboard'

// 通过UA判断是否是移动端
function isMobileUserAgent() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

// 判断是否是移动端
function isMobilePlatform() {
  const plt = navigator.platform
  return !(
    plt.indexOf('Win') > -1 ||
    plt.indexOf('Mac') > -1 ||
    plt.indexOf('Linux') > -1
  )
}

export const useMobile = isMobilePlatform() && isMobileUserAgent()

/**
 * 复制指定DOM元素的内容
 * @param {*} selector        复制按钮选择器
 * @param {*} targetSelector  复制目标选择器
 * @param {*} success         成功回调
 * @param {*} error           错误回调
 * @returns
 */
export function useCopy(selector, targetSelector, success, error) {
  return () => {
    const target = document.querySelector(targetSelector)
    const cp = new clipboard(selector || '#copy', {
      text: () => target.innerText,
    })
    cp.on('success', () => {
      success && success()
      cp.destroy()
    })
    cp.on('error', () => {
      error && error()
    })
  }
}
