import "tailwindcss/tailwind.css";
import Cookies from "js-cookie";
const backend = "http://127.0.0.1:9008";
window.onButtonClick = function () {
  if (isTokenValid(Cookies.get("token"))) {
    redirect();
  } else {
    alert("Token验证失败");
  }
};
window.openChat = function () {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.open('bilibili://space/307268720');
  } else {
    window.open("https://message.bilibili.com/#/whisper/mid307268720");
  }
};
/**
 * 获取url get参数
 * @return object get参数对象
 */
function getUrlParam() {
  let ret = {};
  for (let x of window.location.href.split("?")[1].split("&")) {
    ret[x.split("=")[0]] = x.split("=")[1];
  }
  return ret;
}
window.redirect = function () {
  if (getUrlParam("redirect_uri").redirect_uri) {
    window.location.href =
      getUrlParam("redirect_uri").redirect_uri +
      "#token=" +
      Cookies.get("token");
    throw "stop exec"; //中止代码继续执行
  } else {
  }
};
window.isTokenValid = function (token) {
  var xhr = new XMLHttpRequest();
  var res_data;
  xhr.open("get", backend + "/verify/" + Cookies.get("token"), false); //同步请求
  xhr.send();
  if (xhr.status == 200) {
    res_data = JSON.parse(xhr.responseText);
    return res_data.isAuthed;
  } else {
    return false;
  }
};
// 判断cookie中token是否仍有效
if (Cookies.get("token") && isTokenValid(Cookies.get("token"))) {
  document.getElementById("board").style.display = "none";
  document.getElementById("submit_btn").value = "允许获取";
  document.getElementById("submit_btn").className += " mt-4";
  document.getElementById("bottom_text").innerText =
    "授权后24小时内您无需再次认证";
} else {
  var xhr = new XMLHttpRequest();
  xhr.open("post", backend + "/verify", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var token_item = document.getElementById("token");
      token_item.innerText = xhr.responseText;
      Cookies.set("token", xhr.responseText, { expires: 1 });
    }
  };
  xhr.send();
}
