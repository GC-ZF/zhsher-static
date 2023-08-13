//在文件内直接调用
/*
Toc：
    rightmenu.js：右击美化
    grayscale.js：纪念日节日变灰
    memos.js：首页BB
    nav_menu.js：导航栏美化
    print.js：控制台输出
    social_card.js：社交卡片
    title.js：404title
    universe.js 星空背景
 */

//************ rightmenu.js start ************
function insertAtCursor(myField, myValue) {
    //IE 浏览器
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        sel.select();
    }
    //FireFox、Chrome等
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;

        // 保存滚动条
        var restoreTop = myField.scrollTop;
        myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);

        if (restoreTop > 0) {
            myField.scrollTop = restoreTop;
        }

        myField.focus();
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
        myField.focus();
    }
}

let rmf = {};
rmf.showRightMenu = function (isTrue, x = 0, y = 0) {
    let $rightMenu = $('#rightMenu');
    $rightMenu.css('top', x + 'px').css('left', y + 'px');

    if (isTrue) {
        $rightMenu.show();
    } else {
        $rightMenu.hide();
    }
}
rmf.switchDarkMode = function () {
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
        activateDarkMode()
        saveToLocal.set('theme', 'dark', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
    } else {
        activateLightMode()
        saveToLocal.set('theme', 'light', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
    }
    // handle some cases
    typeof utterancesTheme === 'function' && utterancesTheme()
    typeof FB === 'object' && window.loadFBComment()
    window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200)
};
rmf.copyWordsLink = function () {
    let url = window.location.href
    let txa = document.createElement("textarea");
    txa.value = url;
    document.body.appendChild(txa)
    txa.select();
    document.execCommand("Copy");
    document.body.removeChild(txa);
    Swal.fire("复制成功！");
}
rmf.switchReadMode = function () {
    const $body = document.body
    $body.classList.add('read-mode')
    const newEle = document.createElement('button')
    newEle.type = 'button'
    newEle.className = 'fas fa-sign-out-alt exit-readmode'
    $body.appendChild(newEle)

    function clickFn() {
        $body.classList.remove('read-mode')
        newEle.remove()
        newEle.removeEventListener('click', clickFn)
    }

    newEle.addEventListener('click', clickFn)
}

//复制选中文字
rmf.copySelect = function () {
    document.execCommand('Copy', false, null);
    //这里可以写点东西提示一下 已复制
}

//回到顶部
rmf.scrollToTop = function () {
    btf.scrollToDest(0, 500);
}
rmf.translate = function () {
    document.getElementById("translateLink").click();
}

// 右键菜单事件
document.onkeydown = function (event) {
    event = (event || window.event);
    if (event.keyCode == 17) {
        console.log("你知道的太多了");
        return;
    }
}

function popupMenu() {
    //window.oncontextmenu=function(){return false;}
    window.oncontextmenu = function (event) {
        if (event.ctrlKey) return true;
        console.log(event.keyCode)
        $('.rightMenu-group.hide').hide();
        //如果有文字选中，则显示 文字选中相关的菜单项
        if (document.getSelection().toString()) {
            $('#menu-text').show();
        }
        if (document.getElementById('post')) {
            $('#menu-post').show();
        } else {
            if (document.getElementById('page')) {
                $('#menu-post').show();
            }
        }
        var el = window.document.body;
        el = event.target;
        var a = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
        if (a.test(window.getSelection().toString())) {
            $('#menu-too').show()
        }
        if (el.tagName == 'A') {
            $('#menu-to').show()
            rmf.open = function () {
                location.href = el.href
            }
            rmf.openWithNewTab = function () {
                window.open(el.href);
            }
            rmf.copyLink = function () {
                let url = el.href
                let txa = document.createElement("textarea");
                txa.value = url;
                document.body.appendChild(txa)
                txa.select();
                document.execCommand("Copy");
                document.body.removeChild(txa);
            }
        }
        if (el.tagName == 'IMG') {
            $('#menu-img').show()
            rmf.openWithNewTab = function () {
                window.open(el.src);
            }
            rmf.click = function () {
                el.click()
            }
            rmf.copyLink = function () {
                let url = el.src
                let txa = document.createElement("textarea");
                txa.value = url;
                document.body.appendChild(txa)
                txa.select();
                document.execCommand("Copy");
                document.body.removeChild(txa);
            }
        } else if (el.tagName == "TEXTAREA" || el.tagName == "INPUT") {
            $('#menu-paste').show();
            rmf.paste = function () {
                navigator.permissions
                    .query({
                        name: 'clipboard-read'
                    })
                    .then(result => {
                        if (result.state == 'granted' || result.state == 'prompt') {
                            //读取剪贴板
                            navigator.clipboard.readText().then(text => {
                                console.log(text)
                                insertAtCursor(el, text)
                            })
                        } else {
                            alert('请允许读取剪贴板！')
                        }
                    })
            }
        }
        let pageX = event.clientX + 10;
        let pageY = event.clientY;
        let rmWidth = $('#rightMenu').width();
        let rmHeight = $('#rightMenu').height();
        if (pageX + rmWidth > window.innerWidth) {
            pageX -= rmWidth + 10;
        }
        if (pageY + rmHeight > window.innerHeight) {
            pageY -= pageY + rmHeight - window.innerHeight;
        }

        rmf.showRightMenu(true, pageY, pageX);
        return false;
    };

    window.addEventListener('click', function () {
        rmf.showRightMenu(false);
    });
}

if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    popupMenu()
}

function addLongtabListener(target, callback) {
    let timer = 0 // 初始化timer

    target.ontouchstart = () => {
        timer = 0 // 重置timer
        timer = setTimeout(() => {
            callback();
            timer = 0
        }, 380) // 超时器能成功执行，说明是长按
    }

    target.ontouchmove = () => {
        clearTimeout(timer) // 如果来到这里，说明是滑动
        timer = 0
    }

    target.ontouchend = () => { // 到这里如果timer有值，说明此触摸时间不足380ms，是点击
        if (timer) {
            clearTimeout(timer)
        }
    }
}

//************ rightmenu.js end ************
var zhsher = {
    //************ grayscale.js start ************
    PublicSacrificeDay: () => {
        var PSFarr = new Array("0404", "0404", "0405", "0406", "0414", "0512", "0707", "0807", "0814", "0909", "0918", "0930", "1025", "1213");
        //2020年4月4日 新冠肺炎哀悼日，清明节
        //2010年4月14日，青海玉树地震
        //2008年5月12日，四川汶川地震
        //1937年7月7日,七七事变 又称卢沟桥事变
        //2010年8月7日，甘肃舟曲特大泥石流
        //8月14日，世界慰安妇纪念日
        //1976年9月9日，毛主席逝世
        //1931年9月18日，九一八事变
        //烈士纪念日为每年9月30日
        //1950年10月25日，抗美援朝纪念日
        //1937年12月13日，南京大屠杀
        var currentdate = new Date();
        var str = "";
        var mm = currentdate.getMonth() + 1;
        if (currentdate.getMonth() > 9) {
            str += mm;
        } else {
            str += "0" + mm;
        }
        if (currentdate.getDate() > 9) {
            str += currentdate.getDate();
        } else {
            str += "0" + currentdate.getDate();
        }
        if (PSFarr.indexOf(str) > -1) {
            return 1;
        } else {
            return 0;
        }
    },
    //************ grayscale.js end ************
    //************ memos.js start ************
    // 存数据
    saveData: (name, data) => {
        localStorage.setItem(name, JSON.stringify({'time': Date.now(), 'data': data}))
    },
    // 取数据
    loadData: (name, time) => {
        let d = JSON.parse(localStorage.getItem(name));
        // 过期或有错误返回 0 否则返回数据
        if (d) {
            let t = Date.now() - d.time
            if (-1 < t && t < (time * 60000)) return d.data;
        }
        return 0;
    },

    talkTimer: null,
    indexTalk: () => {
        if (zhsher.talkTimer) {
            clearInterval(zhsher.talkTimer)
            zhsher.talkTimer = null;
        }
        if (!document.getElementById('bber-talk')) return

        function toText(ls) {
            let text = []
            ls.forEach(item => {
                text.push(item.content.replace(/#(.*?)\s/g, '').replace(/\{(.*?)\}/g, '').replace(/\!\[(.*?)\]\((.*?)\)/g, '<i class="fa-solid fa-image"></i>').replace(/(?<!!)\[(.*?)\]\((.*?)\)/g, '<i class="fa-solid fa-link"></i>'))
            });
            return text
        }

        function talk(ls) {
            let html = ''
            ls.forEach((item, i) => {
                html += `<li class="item item-${i + 1}">${item}</li>`
            });
            let box = document.querySelector("#bber-talk .talk-list")
            box.innerHTML = html;
            zhsher.talkTimer = setInterval(() => {
                box.appendChild(box.children[0]);
            }, 3000);
        }

        let d = zhsher.loadData('talk', 10);
        if (d) talk(d);
        else {
            fetch('https://memos.nesxc.com/api/v1/memo?creatorId=2&tag=说说&limit=10').then(res => res.json()).then(data => { // 更改地址
                //小N处理 data = toText(data.data)
                data = toText(data)
                talk(data);
                zhsher.saveData('talk', data);
            })
        }
    },
//************ memos.js end ************
//************ nav_menu.js start ************
// 页面百分比
    percent: () => {
        let a = document.documentElement.scrollTop || window.pageYOffset, // 卷去高度
            b =
                Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.offsetHeight,
                    document.body.clientHeight,
                    document.documentElement.clientHeight
                ) - document.documentElement.clientHeight, // 整个网页高度 减去 可视高度
            result = Math.round((a / b) * 100), // 计算百分比
            btn = document.querySelector("#percent"); // 获取图标

        result <= 99 || (result = 99), (btn.innerHTML = result);
    },


//************ nav_menu.js end ************
//************ print.js start ************
    now1: new Date(),

    createtime1: () => {
        var grt = new Date('05/01/2022 00:00:00') //此处修改你的建站时间或者网站上线时间
        zhsher.now1.setTime(zhsher.now1.getTime() + 250)
        var days = (zhsher.now1 - grt) / 1000 / 60 / 60 / 24
        var dnum = Math.floor(days)

        var ascll = [
            `欢迎来到张时贰\`Blog!`,
            `洞庭春溜满，平湖锦帆张，称小张。十二为一年亦半天亦...家人、恋人、朋友...安好、知心、快乐...十二画，时间、人、情绪，十二是我最喜欢的数字，故称张时贰！`,
            `

  ██╗   ██╗██╗ ██████╗ ██╗     ███████╗████████╗
  ██║   ██║██║██╔═══██╗██║     ██╔════╝╚══██╔══╝
  ██║   ██║██║██║   ██║██║     █████╗     ██║   
  ╚██╗ ██╔╝██║██║   ██║██║     ██╔══╝     ██║   
   ╚████╔╝ ██║╚██████╔╝███████╗███████╗   ██║   
    ╚═══╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝   ╚═╝   
                                              
`,
            '张时贰`Blog 已上线',
            dnum,
            '天',
            '©2022 By 张时贰',
        ]

        setTimeout(
            console.log.bind(
                console,
                `\n%c${ascll[0]} %c ${ascll[1]} %c ${ascll[2]} %c${ascll[3]}%c ${ascll[4]}%c ${ascll[5]}\n\n%c ${ascll[6]}\n`,
                'color:#425aef',
                '',
                'color:#425aef',
                'color:#425aef',
                '',
                'color:#425aef',
                ''
            )
        )
    },


    createtime2: () => {
        var ascll2 = [`NCC2-036`, `调用前置摄像头拍照成功，识别为【小笨蛋】.`, `Photo captured: `, ` 🤪 `]

        setTimeout(
            console.log.bind(
                console,
                `%c ${ascll2[0]} %c ${ascll2[1]} %c \n${ascll2[2]} %c\n${ascll2[3]}\n`,
                'color:white; background-color:#4fd953',
                '',
                '',
                'background:url("https://q1.qlogo.cn/g?b=qq&nk=1310446718&s=5") no-repeat;font-size:450%'
            )
        )

        setTimeout(
            console.log.bind(
                console,
                '%c WELCOME %c 你好，小笨蛋.',
                'color:white; background-color:#4f90d9',
                ''
            )
        )

        setTimeout(
            console.warn.bind(
                console,
                '%c ⚡ Powered by 张时贰 %c 你正在访问 张时贰 的博客.',
                'color:white; background-color:#f0ad4e',
                ''
            )
        )

        setTimeout(
            console.log.bind(
                console,
                '%c W23-12 %c 你已打开控制台.',
                'color:white; background-color:#4f90d9',
                ''
            )
        )
        setTimeout(
            console.warn.bind(
                console,
                '%c S013-782 %c 你现在正处于监控中.',
                'color:white; background-color:#d9534f',
                ''
            )
        )
    },
//************ print.js end ************
//************ social_card.js start ************
    getTimeState: function () {
        var element = (new Date).getHours(), time = "";
        return 0 <= element && element <= 5 ? time = "晚安😴" : 5 < element && element <= 10 ? time = "早上好👋" : 10 < element && element <= 14 ? time = "中午好👋" : 14 < element && element <= 18 ? time = "下午好👋" : 18 < element && element <= 24 && (time = "晚上好👋"), time
    },
    sayhi: function () {
        var element = document.getElementById("author-info__sayhi");
        element && (element.innerHTML = zhsher.getTimeState() + "！我是")
    },
//************ social_card.js end ************
//************ title.js start ************
//标题
    title_404: () => {
        var OriginTitile = document.title;    // 保存之前页面标题
        var titleTime;
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                document.title = '404 Not Found';
                clearTimeout(titleTime);
            } else {
                document.title = 'ヾ(≧▽≦*)o上当了吧嘿嘿';
                titleTime = setTimeout(function () {
                    document.title = OriginTitile;
                }, 3000); // 3秒后恢复原标题
            }
        })
    },
//************ title.js end ************
//************ universe.js start ************
    dark: () => {
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        var n, e, i, h, t = .05,
            s = document.getElementById("universe"),
            o = !0,
            a = "180,184,240",
            r = "226,225,142",
            d = "226,225,224",
            c = [];

        function f() {
            n = window.innerWidth, e = window.innerHeight, i = .216 * n, s.setAttribute("width", n), s.setAttribute("height", e)
        }

        function u() {
            h.clearRect(0, 0, n, e);
            for (var t = c.length, i = 0; i < t; i++) {
                var s = c[i];
                s.move(), s.fadeIn(), s.fadeOut(), s.draw()
            }
        }

        function y() {
            this.reset = function () {
                this.giant = m(3), this.comet = !this.giant && !o && m(10), this.x = l(0, n - 10), this.y = l(0, e), this.r = l(1.1, 2.6), this.dx = l(t, 6 * t) + (this.comet + 1 - 1) * t * l(50, 120) + 2 * t, this.dy = -l(t, 6 * t) - (this.comet + 1 - 1) * t * l(50, 120), this.fadingOut = null, this.fadingIn = !0, this.opacity = 0, this.opacityTresh = l(.2, 1 - .4 * (this.comet + 1 - 1)), this.do = l(5e-4, .002) + .001 * (this.comet + 1 - 1)
            }, this.fadeIn = function () {
                this.fadingIn && (this.fadingIn = !(this.opacity > this.opacityTresh), this.opacity += this.do)
            }, this.fadeOut = function () {
                this.fadingOut && (this.fadingOut = !(this.opacity < 0), this.opacity -= this.do / 2, (this.x > n || this.y < 0) && (this.fadingOut = !1, this.reset()))
            }, this.draw = function () {
                if (h.beginPath(), this.giant) h.fillStyle = "rgba(" + a + "," + this.opacity + ")", h.arc(this.x, this.y, 2, 0, 2 * Math.PI, !1); else if (this.comet) {
                    h.fillStyle = "rgba(" + d + "," + this.opacity + ")", h.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, !1);
                    for (var t = 0; t < 30; t++) h.fillStyle = "rgba(" + d + "," + (this.opacity - this.opacity / 20 * t) + ")", h.rect(this.x - this.dx / 4 * t, this.y - this.dy / 4 * t - 2, 2, 2), h.fill()
                } else h.fillStyle = "rgba(" + r + "," + this.opacity + ")", h.rect(this.x, this.y, this.r, this.r);
                h.closePath(), h.fill()
            }, this.move = function () {
                this.x += this.dx, this.y += this.dy, !1 === this.fadingOut && this.reset(), (this.x > n - n / 4 || this.y < 0) && (this.fadingOut = !0)
            }, setTimeout(function () {
                o = !1
            }, 50)
        }

        function m(t) {
            return Math.floor(1e3 * Math.random()) + 1 < 10 * t
        }

        function l(t, i) {
            return Math.random() * (i - t) + t
        }

        f(), window.addEventListener("resize", f, !1), function () {
            h = s.getContext("2d");
            for (var t = 0; t < i; t++) c[t] = new y, c[t].reset();
            u()
        }(), function t() {
            document.getElementsByTagName('html')[0].getAttribute('data-theme') == 'dark' && u(), window.requestAnimationFrame(t)
        }()
    },
//************ universe.js end ************
    showLoading: () => {
        document.querySelector("#loading-box").classList.remove("loaded")
    }, hideLoading: () => {
        document.querySelector("#loading-box").classList.add("loaded")
    },
}
//Pjax适配
//pjax加载完成前执行的代码
document.addEventListener("pjax:send", function () {
    // console.clear();
    //显示动画
    zhsher.showLoading();
})

function whenDOMReady() {
    // pjax加载完成（切换页面）后需要执行的函数和代码
    //隐藏动画
    zhsher.hideLoading();
    // 纪念日节日变灰
    if (zhsher.PublicSacrificeDay()) {
        document.getElementsByTagName("html")[0].setAttribute("style", "filter:gray !important;filter:grayscale(100%);-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);");
    }
    //memos
    zhsher.indexTalk();
    //导航栏
    document.getElementById("page-name").innerText = document.title.split(" | 张时贰")[0];
    //社交卡片
    zhsher.sayhi();
}

whenDOMReady() // 打开网站先执行一次
document.addEventListener("pjax:complete", whenDOMReady) // pjax加载完成（切换页面）后再执行一次

// whenDOMReady函数外放一些打开网站之后只需要执行一次的函数和代码，比如一些监听代码。
//导航栏
// 返回顶部 显示网页阅读进度
window.onscroll = zhsher.percent; // 执行函数
//右击美化
const box = document.documentElement
addLongtabListener(box, popupMenu);
//print.js 仅打印一次
zhsher.createtime1();
zhsher.createtime2();
//title404
zhsher.title_404();
//星空背景
zhsher.dark();
