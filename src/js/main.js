// css
import '../css/main.css'
import '../css/body.css'
import '../css/mainBox.css'
import '../css/modal.css'
import '../css/md.css'
import '../css/highlight.css'
// photo
import '../images/p1_1_1.png'
import '../images/p1_1_2.png'
import '../images/p1_1_3.png'
import '../images/p1_1_4.png'
import '../images/p1_2_2_1.png'
import '../images/p1_2_2_2.png'
import '../images/p1_2_2_3.png'
import '../images/p1_2_2_4.png'
import '../images/p2_2_2_1.png'
import '../images/p2_2_2_2.png'
import '../images/p2_2_2_3.png'
import '../images/p2_2_2_4.png'
import '../images/p2_2_2_5.png'
import '../images/p2_2_2_6.png'
import '../images/p2_3_1.png'
import '../images/p3_1.png'

// 获取父元素
const list_choice = document.querySelector('.mainBox-choice');
// 获取 data 元素
const data = document.querySelector('#data');
// 获取标题元素
const description = document.querySelector('.mainBox-description');
// 获取内容元素
const input = document.querySelector('.mainBox-input');
// 获取下拉菜单元素
const dropdown = document.querySelector('.dropdown-csv');
// 获取数据可视化标签
const visualization = document.querySelector('#visualization');
// 获取图选项标签
const vStart = document.querySelector('.v-start');
// 获取图列表标签
const vBoard = document.querySelector('.v-board');
// 获取图参数标签
const vChoice = document.querySelector('.v-choice');
// 获取数据集元素
const dataSet = document.querySelector('#v-dataSet');
// 获取数据选项元素
const dataOptions = document.querySelector('#dataSet');

const dataInput = document.querySelector('#v-data');
const options = document.querySelector('#datas');

// 获取画板元素
const vPad = document.querySelector('.v-pad')
// 获取模糊层元素
const overby = document.querySelector('.modal-overby');
// 获取模态框元素
const modal = document.querySelector('.modal');
// 获取标题元素
const title = document.querySelector('.modal-top');
// 获取主体元素
const content = document.querySelector('.modal-body');
// 获取点击元素的父元素
const text = document.querySelector('.mainBox-text');
// 获取翻页元素
const paginationContainer = document.querySelector('.pagination-container');
// 获取可视分析元素
const analysis = document.querySelector('#analysis');
// 获取可视分析界面元素
const analysisInput = document.querySelector('.analysis-input');

function iClick(father, son, style) {
    // 获取父元素
    const vList = document.querySelector(`.${father}`);
    // 捕获点击事件
    vList.addEventListener('click', function (event) {
        if (event.target.classList.contains(`${son}`)) {
            // 移除所有项的 v-style 类
            const items = document.querySelectorAll(`.${son}`);
            items.forEach(i => i.classList.remove(`${style}`));
            // 为被点击的项添加 v-style 类
            event.target.classList.add(`${style}`);
        }
    });
}

iClick('mainBox-text', 'text', 'text-css');

(function showModal() { // 立即执行函数
    // 捕获点击事件
    text.addEventListener('click', function (event) {
        // 检查点击的元素是否是具有 'text' 类的元素
        if (event.target.classList.contains('text') && event.target.id) {
            if (event.target.id === 'tip') {
                title.innerHTML = `
                <h2 class="modal-title">说明</h2>
                <button class="modal-close">&times;</button>`;
                content.innerHTML = `<p>期货日报连续多年举办全国期货实盘交易大赛，在金融投资领域影响越来越大。其中，有一些参赛选手因取得多届实盘交易大赛好成绩，在“长期稳定盈利奖”中排名前列，这些长期稳定盈利的选手是否具有一些共有特性？如何通过数据分析挖掘这些“长期稳定盈利奖”获奖选手的交易特征是一个有意思的问题。本任务是基于公开数据对历届“长期稳定盈利奖”获奖选手进行分析和可视化。</p>`;
            } else if (event.target.id === 'help') {
                title.innerHTML = `
                <h2 class="modal-title">帮助</h2>
                <button class="modal-close">&times;</button>`;
                content.innerHTML = `
                <h1>数据查看:</h1>
                <li>csv 数据文件鼠标悬浮可进行原始数据集点击选择</li>
                <li>上一页、下一页按钮实现数据集表格翻页功能</li>
                <br>
                <h1>数据可视化:</h1>
                <li>数据集鼠标点击键盘输入可进行数据集点击选择</li>
                <li>数据集选择后，选择属性，最后可点击绘图选择进行绘图</li>
                <li>绘图选项鼠标点击可进行图像类型点击选择</li>
                <li>绘图区域鼠标滚轮可进行图像放大缩小</li>
                <li>绘图区域鼠标左键按下可进行图像拖拽，左键放松取消拖拽</li>
                <li>折线图平滑按钮可以实现曲线化</li>
                <br>
                <h1>可视分析:</h1>
                <li>可视分析将笔者整个分析过程进行呈现</li>
                <li>可视分析中的图片点击可进行放大，再次点击可以进行缩小</li>
                <li>可视分析中点击目录会显示各级标题选项，点击可跳转至某一节</li>
                <li>可视分析中各级标题后的"#"符合代表目录，点击可回到目录页面</li>`;
            }
            modal.classList.remove('hidden');
            overby.classList.remove('hidden');
        }
        // 当用户点击 x，关闭模态框
        const close = title.querySelector('.modal-close');
        close.addEventListener('click', function () {
            modal.classList.add('hidden');
            overby.classList.add('hidden');
        }, { once: true }); // 监听一次
    });
})();

(function choiceClick() {
    // 捕获点击事件
    list_choice.addEventListener('click', function (event) {
        if (event.target.classList.contains('choice')) {
            // 移除所有项的 data-border 类
            const items = document.querySelectorAll('.choice');
            items.forEach(i => i.classList.remove('data-border'));
            // 为被点击的项添加 data-border 类
            event.target.classList.add('data-border');
        }
        // 判断
        if (data.classList.contains('data-border')) {
            dropdown.classList.remove('hidden');
            description.classList.remove('hidden');
            input.classList.remove('hidden');
            if (description.innerHTML.length > 0) {
                paginationContainer.classList.remove('hidden');
            }
        } else {
            dropdown.classList.add('hidden');
            description.classList.add('hidden');
            input.classList.add('hidden');
            paginationContainer.classList.add('hidden');
        }
        if (visualization.classList.contains('data-border')) {
            vStart.classList.remove('hidden');
            vChoice.classList.remove('hidden');
            vPad.classList.remove('hidden');
        } else {
            vStart.classList.add('hidden');
            vStart.classList.remove('v-bgc');
            vChoice.classList.add('hidden');
            vBoard.classList.add('hidden');
            vPad.classList.add('hidden');
            dataSet.classList.remove('input-style');
            dataOptions.classList.add('hidden');
            dataInput.classList.remove('input-style');
            options.classList.add('hidden');
        }
        if (analysis.classList.contains('data-border')) {
            analysisInput.classList.remove('hidden');
        } else {
            analysisInput.classList.add('hidden');
        }
    });
})();

iClick('v-list', 'v-li', 'v-style');
