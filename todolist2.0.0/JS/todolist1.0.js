let parentNode = document.body.querySelector(".totle1"); //计划表单所在的父节点
let huancun = []; //缓存数据
let init_status = false; //false说明不在初始化过程，true说明正在初始化

//按回车时的效果
document.addEventListener("keydown", (e) => {
        //添加一个计划时的回车。keydown添加输入框
        if (e.target.className === "keydown" && e.keyCode === 13 && e.target.value !== "") {
            app.message = "xiugai";
            add_clone(e.target.value);
        }
        //修改输入框
        if (e.keyCode === 13) {
            reinput(e.target);
        }
    })
    // 各种单击情况触发函数
document.onclick = (e) => {
    if (e.target.classList.contains("tick")) tick(e.target) //问题选择单击事件
    if (e.target.className === "cha") { //删除问题单击事件
        update_localStorage(3, e.target.parentNode)
        parentNode.removeChild(e.target.parentNode)
    }
}

//修改触发（由双击触发）
document.ondblclick = (e) => {
    if (e.target.classList.contains("text")) {
        let nodes = e.target.parentNode.children;
        for (let i = 0; i < nodes.length; i++) nodes[i].style.display = "none";
        let node = document.createElement("input");
        node.className = "reinput";
        node.value = e.target.innerHTML;
        e.target.parentNode.appendChild(node);
        node.focus();
        node.selectionStart = 0;
    }
}


//添加一条计划
function add_clone(value) {
    //首先复制计划节点，将内容添加到新复制的节点里
    let node_clone_ = document.body.querySelector(".clone").cloneNode(true);
    node_clone_.classList.add("clone_");
    node_clone_.lastChild.innerHTML = value;
    //把节点设置为可见
    node_clone_.style.display = "flex";
    //将新节点加入表单
    parentNode.appendChild(node_clone_);
    //更新本地数据
    update_localStorage(1, value)
        //清空输入框的数据
    document.body.querySelector(".input").lastElementChild.value = "";
    return node_clone_;
}

// 双击修改
// 双击之后在要修改的计划那一栏添加一个reinput的input框。clone_里的
// 其他元素隐藏。
// 转到函数reinput进行修改
function reinput() {
    let node = parentNode.querySelector(".reinput");
    if (node) {
        // 获取重新输入的值
        // 赋给此项计划的text中
        // 移除reinput框，使原有标签可见
        let nodes = node.parentNode.children, //原计划标签的所有孩子都要获取。因为要使可见
            str = node.value;
        update_localStorage(2, [node.parentNode, str]); //更新缓存
        node.parentNode.removeChild(node);
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].style.display = "";
            if (i == nodes.length - 1) {
                nodes[i].innerHTML = str;
            }
            // if (nodes[i] === nodes[i].parentNode.lastChild) {
            //     nodes[i].innerHTML = str;
            // }
        }
    }
}

//选择
// 将计划状态改为以完成或未完成
// 效果使打勾加上删除线
function tick(node) {
    //完成->未完成
    if (node.classList.contains("gou")) {
        node.classList.remove("gou");
        update_localStorage(4, [node.parentNode.parentNode, false]);
        node.parentNode.parentNode.lastChild.classList.remove("line_through");
    } else { //未完成->完成
        node.classList.add("gou");
        update_localStorage(4, [node.parentNode.parentNode, true]);
        node.parentNode.parentNode.lastChild.classList.add("line_through");
    }


}

// 更新缓存信息
// 参数为：num（选择功能），value(内容）
// value:添加时为计划内容。
//删除时value为要删除的节点
//修改时value为数组，value[0]为节点，value[1]为修改后的内容
function update_localStorage(num, value) {
    if (init_status) return;
    if (num === 1) {
        huancun.push([value, false]);
    } else {
        let nodes = Array.isArray(value) ? value[0].parentNode.children : value.parentNode.children;
        let count = 0;
        for (let i = 0; i < nodes.length; i++) { //现在所有缓存里找到要操作的那一个
            if (nodes[i].classList.contains("clone_")) {
                count++;
            }
            if (nodes[i] === (value[0] ? value[0] : value)) { //value若不是数组，则value[0]为undefined，相当于false
                break; //找到就不找了
            }
        }
        if (num === 2 && count !== 0) { //修改计划内容
            huancun[count - 1][0] = value[1];
        }
        if (num === 3 && count !== 0) { //删除计划
            huancun.splice(count - 1, 1);
        }
        if (num === 4 && count !== 0) { //改变计划状态
            huancun[count - 1][1] = value[1];
        }
    }
    localStorage.huancun = JSON.stringify(huancun);
}
document.addEventListener('DOMContentLoaded', () => init())

function init() { //页面初始化开始
    if (localStorage.huancun) {
        init_status = true; //进入初始化状态
        huancun = JSON.parse(localStorage.huancun);
        huancun.forEach((val) => {
            let node = add_clone(val[0]) //读取localStorage添加问题节点
            if (val[1]) { //读取localStorage选择问题打勾
                tick(node.querySelector(".tick"))
            }
            parentNode.appendChild(node);

        })
        init_status = false; //页面初始化结束
    }
}