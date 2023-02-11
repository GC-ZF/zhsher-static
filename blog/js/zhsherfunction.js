"use strict";
//保存函数调用
/*
Toc：
    applybutton.js：友链申请
    custom.js：全局微调 不记录教程
 */

//************ applybutton.js start ************
// 申请友链
function linkCom(type) {
    var n = document.querySelector(".el-textarea__inner")
    if (type == 'bf') {
        n.value = '```yml\n';
        n.value += `- name: 
  link: 
  avatar: 
  descr:  `;
        n.value += '\n```';
        n.setSelectionRange(15, 15);
    } else {
        n.value = '```yml\n';
        n.value += `站点名称：
站点地址：
头像链接：
站点描述：`;
        n.value += '\n```';
        n.setSelectionRange(5, 5);
    }
    n.focus();
}
//************ applybutton.js end ************

//************ custom.js start ************
// //判断国内国外
// var foreignTips = (function () {
//   var fetchUrl = "https://api.ooomn.com/api/ip"
//   console.log('1111111111111111111')
//   fetch(fetchUrl)
//     .then(res => res.json())
//     .then(json =>{
//       var country = json.country;
//       console.log(country);
//       if (country != '中国'){
//         btf.snackbarShow('使用国外网络访问可能无法访问文章图片，敬请谅解。Blog pictures only serve mainland China.')
//       }
//     })
// });

//友链随机传送
function travelling() {
    var fetchUrl = "https://fcircle.zhangshier.vip/randomfriend";
    fetch(fetchUrl)
        .then(res => res.json())
        .then(json => {
            var name = json.name;
            var link = json.link;
            var msg = "点击前往按钮进入随机一个友链，不保证跳转网站的安全性和可用性。本次随机到的是本站友链：「" + name + "」";
            document.styleSheets[0].addRule(':root', '--zhsher-snackbar-time:' + 8000 + 'ms!important');
            Snackbar.show({
                text: msg,
                duration: 8000,
                pos: 'top-center',
                actionText: '前往',
                onActionClick: function (element) {
                    //Set opacity of element to 0 to close Snackbar
                    $(element).css('opacity', 0);
                    window.open(link, '_blank');
                }
            });
        })
}

//前往黑洞
function toforeverblog() {
    var msg = "点击前往按钮进入「十年之约」项目中的成员博客，不保证跳转网站的安全性和可用性";
    Snackbar.show({
        text: msg,
        duration: 8000,
        pos: 'top-center',
        actionText: '前往',
        onActionClick: function (element) {
            //Set opacity of element to 0 to close Snackbar
            $(element).css('opacity', 0);
            window.open(link, 'https://www.foreverblog.cn/go.html');
        }
    });
}

// //前往开往项目
// function totraveling() {
//     btf.snackbarShow('即将跳转到「开往」项目的成员博客，不保证跳转网站的安全性和可用性', false, 5000);
//     setTimeout(function () {
//         window.open('https://www.travellings.cn/go.html');
//     }, "5000");
// }

//F12 检测按键
window.onkeydown = function (e) {
    if (e.keyCode === 123) {
        btf.snackbarShow('开发者模式已打开，请遵循GPL协议', false, 3000)
    }
}
//监听ctrl+CV
document.body.addEventListener("copy", (e => {
    "TEXTAREA" == e.target.tagName && "" == e.target.className || btf.snackbarShow("复制成功~")
}))
document.body.addEventListener("paste", (e => {
    btf.snackbarShow("粘贴成功~")
}))
