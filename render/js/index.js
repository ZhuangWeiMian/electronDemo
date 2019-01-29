// window.onload = function() {
let fs = require('fs');
let path = require('path');

let app = document.getElementById('app');
let index = 0;
app.innerHTML = `
        <h1>每日事项记录</h1>
        <h2>全部事项</h2>
        <ul id="allList"></ul>
    `;
let allList = [];
let hasElement = false;
let ul = document.getElementById('allList');
let element = null;
// 双击出现输入框
window.addEventListener('dblclick', function () {
    getInput();
});

// 判断是否过期，有效时间为当天
function judgeCache(data, lastTime) {
    let time = new Date();    
    let first = time.getTime() - time.getHours() * 60 * 60 - time.getMinutes() * 60 - time.getSeconds();
    
    if (first <= lastTime) {
       return data;
    }
    return [];

}


// 监听点击事件
ul.addEventListener('click', function (e) {
    if (!e.target.id) return false;

    let id = e.target.id;
    if (id.indexOf('done') !== -1) {
        complete(id);
    } else if (id.indexOf('delete') !== -1) {
        deleteTask(id);
    }
});
// 删除任务
function deleteTask(id) {
    let index = id.split('-')[1];
    allList = allList.filter(function (value, i) {
        return +i !== +index;
    });
    renderList(allList, 'allList');
    saveInFile();
}

// 完成任务
function complete(id) {
    let index = id.split('-')[1];
    allList.forEach(function (value, i) {
        if (+i === +index) {
            value.isDone = value.isDone === 'true' ? 'false' : 'true';
            value = Object.assign({}, value);
        }
    })
    renderList(allList, 'allList');
    saveInFile();
}

// 保存数据
function saveInFile() {
    let data = {
        lastModify: new Date(). getTime(),
        allList: allList
    }
    fs.writeFile('task.txt', JSON.stringify(data), function (err, data) {
        if (err) console.log(err);
    });
}

// 读取文件
function readFileToDOM() {
    try {
        let data = fs.readFileSync('task.txt');
        data = JSON.parse(data);
        allList = judgeCache(data.allList, data.lastModify);
    } catch {
        allList = [];
    } finally {
        renderList(allList, 'allList');

    }
}
readFileToDOM();

// 渲染列表
function renderList(list, id) {
    let node = document.getElementById(id);
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < list.length; i++) {
        let template = `
                <i class="icon ${list[i].isDone === 'true'? 'isDone': 'isUndo'}" data-is-done="${list[i].isDone}" id="done-${i}"></i>
                <span class="text">${list[i].text}</span>
                <i class="icon ${list[i].isDone === 'true'? '': 'isDelete'}" id="delete-${i}"></i>
            `;
        let item = document.createElement('li');
        item.innerHTML = template;
        fragment.appendChild(item);
    }
    node.innerHTML = '';
    node.appendChild(fragment);
}

// 获取输入节点
function getInput() {
    let element;
    if (!hasElement) {
        element = document.createElement('input');
        element.id = `text`;
        // 输入框监听回车键，回车即添加
        element.addEventListener('keyup', function (e) {
            if (e.keyCode !== 13) return false;
            let item = {
                isDone: "false",
                text: element.value
            };
            element.value = '';
            allList.push(item);
            renderList(allList, 'allList');
            saveInFile();
        });
        app.insertBefore(element, ul);
        hasElement = true;
    }
}