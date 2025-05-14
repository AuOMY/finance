import './echarts.js'
import { loadCSVFiles } from './check.js'

// 数据集导入
const [, , match_details_6, match_details_7, match_details_8, match_details_9, match_details_10, match_details_11, match_details_12, match_details_13, match_details_14, match_details_15, match_details_16] = await loadCSVFiles();

// 数据集映射
const variableMap = {
    '第6届': match_details_6,
    '第7届': match_details_7,
    '第8届': match_details_8,
    '第9届': match_details_9,
    '第10届': match_details_10,
    '第11届': match_details_11,
    '第12届': match_details_12,
    '第13届': match_details_13,
    '第14届': match_details_14,
    '第15届': match_details_15,
    '第16届': match_details_16
};
// 数据集
const data = ['第6届', '第7届', '第8届', '第9届', '第10届', '第11届', '第12届', '第13届', '第14届', '第15届', '第16届'];
// 输入框
const dataSet = document.querySelector('#v-dataSet');
// 建议菜单
const dataOptions = document.querySelector('#dataSet');
// 数据对象
const element = { input: document.querySelector('#v-data'), options: document.querySelector('#datas'), data: [] };
// 获取图选项标签
const vStart = document.querySelector('.v-start');
// 获取图列表标签
const vBoard = document.querySelector('.v-board');
// 图类型元素
const vList = document.querySelector('.v-list');
// 画板元素
const pad = document.querySelector('.v-pad');
// 平滑按钮
const smooth = document.querySelector('#smooth');

(function dataSetOp () {
    // 初始化建议菜单
    dataOptions.innerHTML = data.map(i => `<p class="options">${i}</p>`).join('');
    // 建议菜单样式
    dataSet.addEventListener('focus', function () {
        dataSet.classList.add('input-style');
        dataOptions.classList.remove('hidden');
    });
    // 输入事件
    dataSet.addEventListener('input', function () {
        const inputValue = dataSet.value;
        const filteredData = inputValue ? data.filter(item => item.includes(inputValue)) : data;
        // 更新建议菜单
        if (filteredData.length > 0) {
            dataOptions.innerHTML = filteredData.map(item => `<p class="options">${item}</p>`).join('');
        } else {
            dataOptions.innerHTML = '';
        }
        if (!data.includes(dataSet.value)) {
            element.input.classList.add('hidden');
            element.input.classList.remove('input-style');
            element.options.classList.add('hidden');
        }
    });
    // 点击事件
    dataOptions.addEventListener('click', function (event) {
        if (event.target.classList.contains('options')) {
            dataSet.value = event.target.textContent;
            dataOptions.classList.add('hidden');
            dataOptions.innerHTML = '';
            if (data.includes(dataSet.value)) {
                element.input.classList.remove('hidden');
                dataOptions.classList.add('hidden');
                dataSet.classList.remove('input-style');
                element.input.value = '';
            }
        }
        element.data.splice(0, element.data.length, ...variableMap[dataSet.value][0].filter(i => i !== '昵称' && i !== '组别' && i !== '组账户数' && i !== '账户昵称' && i !== '操作指导' && i !== '参赛日期' && i !== '指定交易商'));
        element.options.innerHTML = element.data.map(i => `<p class="options">${i}</p>`).join('');
    });
    // 数据各事件
    element.input.addEventListener('focus', function () {
        element.input.classList.add('input-style');
        element.options.classList.remove('hidden');
    });
    element.input.addEventListener('input', function () {
        const inputValue = element.input.value;
        const filteredData = inputValue ? element.data.filter(item => item.includes(inputValue)) : element.data;
        // 更新建议菜单
        if (filteredData.length > 0) {
            element.options.innerHTML = filteredData.map(item => `<p class="options">${item}</p>`).join('');
        } else {
            element.options.innerHTML = '';
        }
    });
    element.options.addEventListener('click', function (event) {
        if (event.target.classList.contains('options')) {
            element.input.value = event.target.textContent;
            element.options.classList.add('hidden');
            element.input.classList.remove('input-style');
            element.options.innerHTML = '';
        }
    });
})();

(function showVList() {
    // 状态切换
    let isVisible = false;
    // 捕获点击事件
    vStart.addEventListener('click', function () {
        if (!isVisible && data.includes(dataSet.value) && element.data.includes(element.input.value)) {
            vStart.classList.add('v-bgc');
            vBoard.classList.remove('hidden');
            isVisible = true;
        } else {
            vStart.classList.remove('v-bgc');
            vBoard.classList.add('hidden');
            isVisible = false;
        }
    });
})();

const vwToPx = (vw) => (window.innerWidth * vw) / 100;

function numbersArray(length) {
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error("长度必须是一个正整数");
    }
    return Array.from({ length }, (_, index) => index + 1);
}

function filterCsvData(csvArray) {
    if (!Array.isArray(csvArray) || csvArray.length === 0) {
        throw new Error("输入必须是一个非空数组");
    }
    // 表头
    const headers = csvArray[0];
    // 定义需要检查空值的列索引
    const columnsToCheck = ["期初权益", "期末权益", "累计入金", "累计出金", "累计净值", "累计净值排名", "累计净利润", "累计净利润排名", "日收益率均值", "日收益率最大", "日收益率最小", "年化收益率", "盈利天数", "亏损天数", "交易胜率", "盈亏比", "手续费/净利润", "风险度均值"];
    // 获取需要检查的列索引
    const indicesToCheck = columnsToCheck.map(column => headers.indexOf(column)).filter(index => index !== -1);
    // 过滤掉含有指定列空值的行
    const filteredData = csvArray.filter((row, index) => {
        // 跳过表头
        if (index === 0) return true;
        // 检查指定列是否有空值
        return indicesToCheck.every(index => row[index] !== null && row[index] !== '');
    });
    return filteredData;
}

function extractColumn(dataArray, columnName) {
    // 表头
    const headers = dataArray[0];
    // 索引
    const columnIndex = headers.indexOf(columnName);
    if (columnIndex === -1) {
        console.warn(`列 "${columnName}" 未找到.`);
        return [];
    }
    // 提取指定列的数据
    const columnData = dataArray.slice(1).map(row => row[columnIndex]);
    return columnData;
}

let chart;
let isSmooth = false;
function createChart(type, name, xdata, ydata) {
    chart = chart ? (chart.clear(), chart) : echarts.init(pad);
    let option = {
        title: {
            text: type === 'bar' ? '柱状图' : type === 'line' ? '折线图' : '散点图',
            textStyle: {
                color: 'white',
                fontSize: vwToPx(1),
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                const index = params.dataIndex;
                return `${name[index]}: ${params.value}`;
            },
            textStyle: {
                color: 'black',
                fontWeight: 'bold'
            },
        },
        legend: {
            textStyle: {
                color: 'white'
            }
        },
        xAxis: {
            data: xdata
        },
        yAxis: {},
        series: [
            {
                name: type === 'bar' ? '柱状图' : type === 'line' ? '折线图' : '散点图',
                type: type,
                data: ydata,
                itemStyle: {
                    color: 'goldenrod'
                },
                smooth: type === 'line' ? isSmooth : false
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                crrsor: 'grab'
            },
            {
                type: 'slider',
                start: 0,
                end: 100
            }
        ]
    };
    chart.setOption(option);
    
    if (type === 'line') {
        smooth.classList.remove('hidden');
    } else {
        smooth.classList.add('hidden');
    }
}

(function lineSmooth () {
    smooth.addEventListener('click', function() {
        if (chart) {
            const currentType = chart.getOption().series[0].type;
            if (currentType === 'line') {
                isSmooth = !isSmooth;
                chart.setOption({
                    series: [{
                        smooth: isSmooth
                    }]
                });
            }
        }
    });
})();

(function draw () {
    vList.addEventListener('click', function (event) {
        if (data.includes(dataSet.value) && element.data.includes(element.input.value)){
            const type = event.target.id;
            const ds = filterCsvData(variableMap[dataSet.value].default)
            const name = extractColumn(ds, '昵称');
            const xdata = numbersArray(name.length);
            const ydata = extractColumn(ds, element.input.value);
            (type === 'bar' || type === 'line' || type === 'scatter') && createChart(type, name, xdata, ydata);
        }
    });
})();