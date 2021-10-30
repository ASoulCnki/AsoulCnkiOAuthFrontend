function isMobileUserAgent() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

function isMobilePlatform() {
  const plt = navigator.platform
  return (
    plt.indexOf('Win') > -1 ||
    plt.indexOf('Mac') > -1 ||
    plt.indexOf('Linux') > -1
  )
}

export const useMobile = isMobilePlatform() && isMobileUserAgent()
