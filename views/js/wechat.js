/* 
    聊天室主要功能
*/

// 用户信息展示
const avatar = window.sessionStorage.getItem('avatar');
const name = window.sessionStorage.getItem('name');

document.querySelector('.user_header').src = avatar;
document.querySelector('.user_name').innerText = name;

// 获取所有用户
getAllUsers();

var socket = new WebSocket('ws://localhost:3000/ws/users?uid=' + window.sessionStorage.getItem('uid'));

socket.addEventListener('open', function () {
    console.log('连接成功');
    //主动发送信息
    // setTimeout(() => { socket.send(JSON.stringify("你好1")) }, 2000);
})

// 接收服务端的信息
socket.onmessage = function (e) {
    let { data } = e;
    data = JSON.parse(data);
    console.log(data);

    const { type } = data;

    // 聊天室数
    let chatCount = document.getElementById('userCount');

    // 聊天记录
    let chatMsg = document.querySelector('.chat_msg');

    if (type == 0) {
        // 用户退出
        const { total, name } = data;
        chatCount.innerText = total;

        // 当前用户数
        let ul = document.getElementById('online_users');

        let li = ul.getElementsByTagName('li');

        // 遍历li数组
        for (const item of li) {
            if (item.children[1].innerText === name) {
                // 移除此元素
                item.parentNode.removeChild(item);
            }
        }

        // 聊天内容，提示谁退出
        chatMsg.innerHTML += `<div class="chat_tip">"${name}"离开聊天室</div>`;

        // 滑动到可视区
        chatMsg.lastElementChild.scrollIntoView(false);

    } else if (type == 1) {
        // 用户登录
        const { list, total, name } = data;

        // 聊天室总数
        chatCount.innerText = total;

        // 当前用户列表
        let ul = document.getElementById('online_users');

        let li = '';
        for (const user of list) {
            li += `
                <li>
                    <img src="${user.avatar}" alt="">
                    <span>${user.nickname}</span>
                </li>
            `
        }
        ul.innerHTML = li;

        // 聊天内容，提示谁登录
        chatMsg.innerHTML += `<div class="chat_tip">"${name}"加入群聊</div>`;

        // 滑动到可视区
        chatMsg.lastElementChild.scrollIntoView(false);

    } else {
        // 发送信息
        const { msg, user } = data;

        if (user.name == name) {
            // 自己发送的信息
            chatMsg.innerHTML += `
                <div class="my_msg">
                    <div class="my_say">
                        ${msg}
                    </div>
                    <img class="my_head" src="${user.avatar}" alt="">
                </div>
            `
        } else {
            // 别人发送的信息
            chatMsg.innerHTML += `
                <div class="other_msg">
                    <img class="other_head" src="${user.avatar}" alt="">
                    <div class="other_say_row">
                        <i class="other_name">${user.name}</i>
                        <div class="other_say">${msg}</div>
                    </div>
                </div>
            `
        }
        // 滑动到可视区
        chatMsg.lastElementChild.scrollIntoView(false);
    }
}

// 回车发送内容
let content = document.getElementById('content');

content.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        sendThing();
    }
})

// 点发送按钮
document.getElementById('chat_btn').addEventListener('click', sendThing)

// 发送文件
document.getElementById('file').addEventListener('change', function (e) {

    // 获取此文件
    var file = this.files[0];

    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = function () {
        // socket.send(JSON.stringify({
        //     type: 0,
        //     data: fr.result
        // }));
        content.innerHTML += `<img style="vertical-align:bottom" src="${fr.result}" alt=""/>`
    }

})


// 获取表情包容器
let faceContainer = document.querySelector('.faceNav');

// 获取触发表情包的元素
document.getElementById('face_emoji').addEventListener('click', function (e) {
    // 阻止冒泡
    e.stopPropagation();

    faceContainer.style.display = 'block';

    document.body.addEventListener('click', function () {
        faceContainer.style.display = 'none';
    })

    document.body.onclick = null;
});




// 显示表情包
faceContainer.onclick = function (e) {
    const event = e || window.event;
    let target = event.target || event.srcElement;

    // 点击的是表情
    if (target.classList.contains('qqface') || Array.from(target.classList).includes('qqface')) {
        const id = target.dataset.id;

        // 插入到聊天框中
        content.innerHTML += `
            <img style="width:20px;height:20px;" src='https://res.wx.qq.com/mpres/zh_CN/htmledition/pages/modules/common/emoji/images/smiley/smiley_${id}4273fb.png' data-id="${id}"/>
        `
    }

}

// 初始化表情包
showFace();
function showFace() {
    let qqfaceArr = [['[微笑]', '0'], ['[撇嘴]', '1'], ['[色]', '2'], ['[发呆]', '3'], ['[得意]', '4'], ['[流泪]', '5'], ['[害羞]', '6'], ['[闭嘴]', '7'], ['[睡]', '8'], ['[大哭]', '9'], ['[尴尬]', '10'], ['[发怒]', '11'], ['[调皮]', '12'], ['[呲牙]', '13'], ['[惊讶]', '14'], ['[难过]', '15'],
    ['[酷]', '16'], ['[囧]', '17'], ['[抓狂]', '18'], ['[吐]', '19'], ['[偷笑]', '20'], ['[愉快]', '21'], ['[白眼]', '22'], ['[傲慢]', '23'], ['[饥饿]', '24'], ['[困]', '25'], ['[惊恐]', '26'], ['[流汗]', '27'], ['[憨笑]', '28'], ['[悠闲]', '29'], ['[奋斗]', '30'],
    ['[咒骂]', '31'], ['[疑问]', '32'], ['[嘘]', '33'], ['[晕]', '34'], ['[疯了]', '35'], ['[衰]', '36'], ['[骷髅]', '37'], ['[敲打]', '38'], ['[再见]', '39'], ['[擦汗]', '40'], ['[抠鼻]', '41'], ['[鼓掌]', '42'], ['[糗大了]', '43'], ['[坏笑]', '44'], ['[左哼哼]', '45'],
    ['[右哼哼]', '46'], ['[哈欠]', '47'], ['[鄙视]', '48'], ['[委屈]', '49'], ['[快哭了]', '50'], ['[阴险]', '51'], ['[亲亲]', '52'], ['[吓]', '53'], ['[可怜]', '54'], ['[菜刀]', '55'], ['[西瓜]', '56'], ['[啤酒]', '57'], ['[篮球]', '58'], ['[乒乓]', '59'], ['[咖啡]', '60'],
    ['[饭]', '61'], ['[猪头]', '62'], ['[玫瑰]', '63'], ['[凋谢]', '64'], ['[嘴唇]', '65'], ['[爱心]', '66'], ['[心碎]', '67'], ['[蛋糕]', '68'], ['[闪电]', '69'], ['[炸弹]', '70'], ['[刀]', '71'], ['[足球]', '72'], ['[瓢虫]', '73'], ['[便便]', '74'], ['[月亮]', '75'],
    ['[太阳]', '76'], ['[礼物]', '77'], ['[拥抱]', '78'], ['[强]', '79'], ['[弱]', '80'], ['[握手]', '81'], ['[胜利]', '82'], ['[抱拳]', '83'], ['[勾引]', '84'], ['[拳头]', '85'], ['[差劲]', '86'], ['[爱你]', '87'], ['[NO]', '88'], ['[OK]', '89'], ['[爱情]', '90'],
    ['[飞吻]', '91'], ['[跳跳]', '92'], ['[发抖]', '93'], ['[怄火]', '94'], ['[转圈]', '95'], ['[磕头]', '96'], ['[回头]', '97'], ['[跳绳]', '98'], ['[投降]', '99'], ['[激动]', '100'], ['[乱舞]', '101'], ['[献吻]', '102'], ['[左太极]', '103'], ['[右太极]', '104']];
    let str = '';
    qqfaceArr.map((item, index) => {
        str += `<div class="qqface qqface${item[1]}" data-id="${item[1]}" data-name="${item[0]}"></div>`;
    });
    faceContainer.innerHTML = str;
}

// 图片展示容器
let imgContainer = document.getElementById('img_container');
// 图片
let showImgURL;

// 截屏
document.getElementById('screen').onclick = function () {
    // Alert('请确定你要截取的区域,可用鼠标选择');

    html2canvas(document.body).then(canvas => {
        console.log(canvas);
        //转换为base64图片数据
        let img = document.createElement('img');
        img.setAttribute("crossOrigin", 'Anonymous');
        img.style.maxWidth = '500px';
        img.style.maxHeight = '350px';
        // img.setAttribute("height", '90vw');
        // img.setAttribute("width", '90vh');

        img.setAttribute("verticalAlign", 'bottom');

        const imgUrl = canvas.toDataURL("image/png");

        img.src = imgUrl;

        // 存储此图片
        showImgURL = imgUrl;

        content.appendChild(img);

        //展示图片 
        // document.querySelector('.screen').src = imgUrl;
        // imgContainer.style.display = 'block';
    })
}

// 截屏取消
document.getElementById('screen_delete').onclick = function () {
    imgContainer.style.display = 'none';
}

// 截屏确定
document.getElementById('screen_confirm').onclick = function () {
    
    let img = document.createElement('img');

    img.src = showImgURL;
    img.setAttribute("crossOrigin", 'Anonymous');
    img.style.maxWidth = '500px';
    img.style.maxHeight = '350px';
    img.setAttribute("verticalAlign", 'bottom');

    content.appendChild(img);
    imgContainer.style.display = 'none';
}

let imgPic = document.querySelector('.screen');

imgPic.onmousedown = function (event) {
    event.preventDefault();

    const imgLeft = event.clientX - imgPic.offsetLeft;
    const imgTop = event.clientY - imgPic.offsetTop;

    document.onmouseup = function (event) {

        const imgRight = event.clientX - imgPic.offsetLeft;
        const imgBottom = event.clientY - imgPic.offsetTop;

        handleImg({
            src: document.querySelector('.screen').src,
            rect: {
                x: imgLeft < imgRight ? imgLeft : imgRight, // 截取方格左上角横坐标
                y: imgTop < imgBottom ? imgTop : imgBottom, // 截取方格左上角纵坐标
                width: Math.abs(imgRight - imgLeft), // 截取方格宽度
                height: Math.abs(imgBottom - imgTop) // 截取方格高度
            }
        }).then(res => {
            // document.getElementById('img2').src = res;
            showImgURL = res;

            document.onmouseup = null;
            // imgPic.src = res;
        }).catch(err => {
            console.log(err);
        })
    }
}

function handleImg(opts) {
    return new Promise((resolve, reject) => {
        console.log(opts);
        const { src, rect } = opts
        if (!src || !rect) {
            reject(new Error('opts params Error!'))
        }
        const img = new Image();
        img.setAttribute("crossOrigin", 'Anonymous');
        img.src = src;
        img.onload = function () {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const { x, y, width, height } = rect
            canvas.width = width
            canvas.height = height
            ctx.drawImage(this, x, y, width, height, 0, 0, width, height)
            const url = canvas.toDataURL('image/png');
            resolve(url);
        };
        img.onerror = function (err) {
            reject(err)
        }
    })
}

// 发送信息
function sendThing() {
    let text = content.innerHTML.trim();

    if (!text) {
        // 清空内容
        setTimeout(() => {
            content.innerHTML = '';
        }, 0)
        return Alert('内容不能为空');
    }

    // 发送信息
    socket.send(JSON.stringify({
        data: text
    }));

    // 清空内容
    setTimeout(() => {
        content.innerHTML = '';
    }, 0)
}

// 获取所有用户
function getAllUsers() {
    ajaxGet('/user').then(res => {
        const { data } = res;

        console.log(res);
        let li = '';
        for (const item of data) {
            li += `
                <li>
                    <img src="${item.avatar}" alt="">
                    <span>${item.nickname}</span>
                </li>
            `
        }
        document.getElementById('allUsers').innerHTML = li;

    }).catch(err => {
        console.log(err);
    })
}