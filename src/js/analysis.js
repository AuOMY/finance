// 获取图像元素
const photos = document.querySelectorAll('.photo');
// 获取全屏图像元素
const full = document.querySelector('.full img');
// 获取模糊层元素
const overby = document.querySelector('.modal-overby');
// 获取代码块元素
const codeBox = document.querySelectorAll('.code-container');
// 获取目录标题元素
const contentTitle = document.querySelector('#section0');
// 获取目录元素
const content = document.querySelector('.md-content');
// 获取目录链接元素
const a = document.querySelectorAll('.md-a');
// 获取表格盒子元素
const tableContainer = document.querySelector('#table-container');
// 获取表格元素
const table = document.querySelector('.analysis-table');
// 获取翻页元素
const container = document.querySelector('.table-goto');
// 箱线图元素
const boxplot = document.getElementById('boxplot');
// 搜索结果元素
const analysisContainer = document.querySelector('#analysis-container');

(function toggleFullscreen () {
    photos.forEach(i => i.addEventListener('click', function () {
        if (full.classList.contains('hidden')) {
            full.src = this.src;
            full.classList.remove('hidden');
            overby.classList.remove('hidden');
            document.querySelector('body').style.overflow = 'auto';
            const handleFullClick = function() {
                full.src = '';
                full.classList.add('hidden');
                overby.classList.add('hidden');
                document.querySelector('body').style.overflow = 'hidden';
                full.removeEventListener('click', handleFullClick);
            };
            full.addEventListener('click', handleFullClick);
        }
    }))
})();

(function toggleCode() {
    codeBox.forEach(i => {
        // 获取代码块隐藏按钮
        const codeHide = i.querySelector('.code-hide');
        // 获取代码块元素
        const codeBlock = i.querySelector('.code-block');
        // 获取代码标签元素
        const codeLabel = i.querySelector('.language-label');
        // 状态变量
        let isExpanded = false;
        codeHide.addEventListener('click', function () {
            if (isExpanded) {
                codeBlock.style.height = '1.5vw';
                codeBlock.style.overflowX = 'hidden';
                codeHide.textContent = '展开';
                codeLabel.classList.add('hidden');
            } else {
                codeBlock.style.height = codeBlock.scrollHeight + 'px';
                codeBlock.style.overflowX = 'auto';
                codeHide.textContent = '折叠';
                codeLabel.classList.remove('hidden');
            }
            isExpanded = !isExpanded;
        })
    })
})();

(function showContent () {
    let isShow = false;
    contentTitle.addEventListener('click', function () {
        if (!isShow) {
            content.style.height = content.scrollHeight + 'px';
        } else {
            content.style.height = '0';
        }
        isShow = !isShow;
    })
})();

(function jump () {
    let allJump = [];
    a.forEach(i => {
        if (i.href.search('#')) {
            allJump.push(i);
        }
    })

    allJump.forEach(ele => {
        ele.addEventListener('click', function (event) {
            if (event.target.id !== 'ex-link') {
                event.preventDefault();
                const jumpTarget = ele.href.split('#')[1];
                if (jumpTarget) {
                    const target = document.querySelector('#' + CSS.escape(jumpTarget));
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        })
    })
})();

async function loadTableData() {
    // 动态导入 CSV 文件
    const grouped_max = await import(/* webpackChunkName: "grouped_max" */ '../../bigData/src/grouped_max.csv');
    const grouped_min = await import(/* webpackChunkName: "grouped_min" */ '../../bigData/src/grouped_min.csv');
    const grouped_means = await import(/* webpackChunkName: "grouped_means" */ '../../bigData/src/grouped_means.csv');
    const grouped_median = await import(/* webpackChunkName: "grouped_median" */ '../../bigData/src/grouped_median.csv');

    return [grouped_max.default, grouped_min.default, grouped_means.default, grouped_median.default];
}

const [grouped_max, grouped_min, grouped_means, grouped_median] = await loadTableData();

function showTable(dataSet) {
    const itemsPerPage = 40;
    let currentPage = 1;

    table.innerHTML = '';
    container.innerHTML = '';

    // 创建表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // 假设 CSV 的第一行是表头
    const headers = dataSet[0]; // 取第一个数据集的键作为表头
    const data = dataSet.slice(1); // 获取数据（去掉表头）
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 计算总页数
    const totalPages = Math.ceil(data.length / itemsPerPage);

    function renderTable() {
        const tbody = document.createElement('tbody');
        const start = (currentPage - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, data.length);

        for (let i = start; i < end; i++) {
            const row = document.createElement('tr');
            const rowData = data[i];

            rowData.forEach(data => {
                const td = document.createElement('td');
                td.textContent = data; // 假设数据是简单的值
                row.appendChild(td);
            });

            tbody.appendChild(row);
        }

        // 清空之前的表体并添加新的表体
        table.querySelector('tbody')?.remove(); // 移除旧的表体
        table.appendChild(tbody);
    }

    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    container.appendChild(paginationContainer);
    
    function renderPagination() {
        paginationContainer.innerHTML = ''; // 清空现有分页内容

        // 创建下拉菜单
        const dropdown = document.createElement('select');
        const options = ['均值', '最大值', '最小值', '中位值'];
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            dropdown.appendChild(opt);
        });
        paginationContainer.appendChild(dropdown); // 将下拉菜单添加到容器中

        // 更新下拉菜单的值
        dropdown.value = getDropdownValue(dataSet);

        // 监听下拉菜单选择
        dropdown.addEventListener('change', () => {
            switch (dropdown.value) {
                case '均值':
                    showTable(grouped_means);
                    break;
                case '最大值':
                    showTable(grouped_max);
                    break;
                case '最小值':
                    showTable(grouped_min);
                    break;
                case '中位值':
                    showTable(grouped_median);
                    break;
            }
            document.querySelector('.analysis-search').innerHTML = '';
        });

        // 创建隐藏表格按钮
        const hideTableButton = document.createElement('button');
        hideTableButton.textContent = '隐藏表格';
        let isHide = false;
        hideTableButton.addEventListener('click', () => {
            if (!isHide) {
                hideTableButton.textContent = '展开表格';
                tableContainer.style.height = '0vw';
            } else {
                hideTableButton.textContent = '隐藏表格';
                tableContainer.style.height = '20vw';
            }
            isHide = !isHide;
        });
        paginationContainer.appendChild(hideTableButton); // 将按钮添加到容器中

        // 创建上一页按钮
        const prevButton = createPaginationButton('上一页', currentPage === 1, () => {
            if (currentPage > 1) {
                currentPage--;
                updatePaginationAndTable();
            }
        });
        paginationContainer.appendChild(prevButton);

        // 创建页码信息
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;
        paginationContainer.appendChild(pageInfo);

        // 创建下一页按钮
        const nextButton = createPaginationButton('下一页', currentPage === totalPages, () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePaginationAndTable();
            }
        });
        paginationContainer.appendChild(nextButton);

        // 创建跳转输入框
        const jumpInput = createJumpInput();
        paginationContainer.appendChild(jumpInput.input);
        paginationContainer.appendChild(jumpInput.button);
    }

    function createPaginationButton(text, isDisabled, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.disabled = isDisabled;
        button.addEventListener('click', onClick);
        return button;
    }

    function createJumpInput() {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = totalPages;
        input.value = currentPage; // 默认值为当前页码
        input.placeholder = '跳转到页码';

        const button = document.createElement('button');
        button.textContent = '跳转';
        button.addEventListener('click', () => {
            const targetPage = parseInt(input.value);
            if (targetPage >= 1 && targetPage <= totalPages) {
                currentPage = targetPage;
                updatePaginationAndTable();
            } else {
                alert(`请输入有效的页码（1 - ${totalPages}）`);
            }
        });

        return { input, button };
    }

    function getDropdownValue(dataSet) {
        if (dataSet === grouped_means) return '均值';
        if (dataSet === grouped_max) return '最大值';
        if (dataSet === grouped_min) return '最小值';
        if (dataSet === grouped_median) return '中位值';
        return options[0]; // 默认值
    }

    function updatePaginationAndTable() {
        renderTable();
        renderPagination();
    }

    function showSearch () {
        const searchContainer = document.querySelector('.table-search');
        searchContainer.innerHTML = '';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '输入昵称搜索';
        searchContainer.appendChild(searchInput);
    
        const searchButton = document.createElement('button');
        searchButton.textContent = '搜索';
        searchButton.addEventListener('click', () => {
            if (searchInput.value) {
                performSearch(searchInput.value);
            }
        });
        searchContainer.appendChild(searchButton);
    
        function performSearch(searchTerm) {
            // 假设 data 是一个全局变量，包含要搜索的数据
            const filteredData = data.filter(row => row[0].toLowerCase().includes(searchTerm.toLowerCase()));
            
            const analysisSearchContainer = document.querySelector('.analysis-search');
            analysisSearchContainer.innerHTML = ''; // 清空之前的内容

            // 创建表格并添加表头
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            // 添加表头
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // 渲染所有匹配的结果
            const tbody = document.createElement('tbody');
            filteredData.forEach(rowData => {
                const row = document.createElement('tr');
                rowData.forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            analysisSearchContainer.appendChild(table);
        }
    }

    renderTable(); // 初始渲染表格
    renderPagination(); // 初始渲染分页
    showSearch(); // 搜索功能
}


showTable(grouped_means);

let groupAccountCount = []; // 账户组数
let initialEquity = []; // 期初权益
let finalEquity = []; // 期末权益
let totalDeposit = []; // 累计入金
let totalWithdrawal = []; // 累计出金
let totalNetValue = []; // 累计净值
let totalNetProfit = []; // 累计净利润
let profitableDays = []; // 盈利天数
let losingDays = []; // 亏损天数
let winRate = []; // 交易胜率
let profitLossRatio = []; // 盈亏比
let feeToNetProfit = []; // 手续费/净利润

function getColumnData(nickname) {
    const object = groupedData[nickname];

    groupAccountCount.length = 0;
    initialEquity.length = 0;
    finalEquity.length = 0;
    totalDeposit.length = 0;
    totalWithdrawal.length = 0;
    totalNetValue.length = 0;
    totalNetProfit.length = 0;
    profitableDays.length = 0;
    losingDays.length = 0;
    winRate.length = 0;
    profitLossRatio.length = 0;
    feeToNetProfit.length = 0;

    if (object && Array.isArray(object.data)) {
        object.data.forEach(dataEntry => {
            groupAccountCount.push(dataEntry[2]);
            initialEquity.push(dataEntry[3]);
            finalEquity.push(dataEntry[4]);
            totalDeposit.push(dataEntry[5]);
            totalWithdrawal.push(dataEntry[6]);
            totalNetValue.push(dataEntry[7]);
            totalNetProfit.push(dataEntry[8]);
            profitableDays.push(dataEntry[9]);
            losingDays.push(dataEntry[10]);
            winRate.push(dataEntry[11]);
            profitLossRatio.push(dataEntry[12]);
            feeToNetProfit.push(dataEntry[13]);
        });
    }
}

const vwToPx = (vw) => (window.innerWidth * vw) / 100;

let chart;
function drawBasicData (name) {
    chart = chart ? (chart.clear(), chart) : echarts.init(boxplot);
    const option = {
        title: [
          {
            text: `选手 ${name} 基本数据箱线图`,
            left: 'center',
            textStyle: {
                color: 'white',
                fontSize: vwToPx(1),
                fontWeight: 'bold'
            }
          }
        ],
        dataset: [
          {
            source: [
                groupAccountCount,
                initialEquity,
                finalEquity,
                totalDeposit,
                totalWithdrawal,
                totalNetValue,
                totalNetProfit,
                profitableDays,
                losingDays,
                winRate,
                profitLossRatio,
                feeToNetProfit
            ]
          },
          {
            transform: {
              type: 'boxplot',
              config: { itemNameFormatter: function (params) {
                const xName = ['账户组数', '期初权益', '期末权益', '累计入金', '累计出金', '累计净值', '累计净利润', '盈利天数', '亏损天数', '交易胜率', '盈亏比', '手续费/净利润'];
                return xName[params.value];
              }}
            }
          },
          {
            fromDatasetIndex: 1,
            fromTransformResult: 1
          }
        ],
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          nameGap: 30,
          axisLabel: {
            interval: 0,
            fontSize: vwToPx(0.8),
            margin: 10
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitArea: {
            show: true
          }
        },
        series: [
          {
            name: 'boxplot',
            type: 'boxplot',
            datasetIndex: 1,
            itemStyle: {
                color: 'rgba(218, 165, 32, 0.4)',
                borderColor: 'goldenrod',
                borderWidth: 3
            }
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
      
    chart.setOption(option)
}

function loadData (dataSet, data) {
    dataSet.default.forEach((row, index) => {
        if (row.length === 0 || row.every(cell => cell === '')) {
            return;
        }
        if (index === 0) {
            h = row;
            return;
        }
        const nickname = row[0];
        if (!data[nickname]) {
            data[nickname] = {
                headers: h,
                data: []
            };
        }
        data[nickname].data.push(row);
    });
}

let groupedData = {};
let h = [];
async function loadCombinedData() {
    const combinedDF = await import(/* webpackChunkName: "combined_data" */ '../../bigData/src/combined_data.csv');
    loadData(combinedDF, groupedData);

    [tableContainer, analysisContainer].forEach(i => i.addEventListener('click', (event) => {
        if (event.target.tagName === 'TD' && event.target.cellIndex === 0) {
            const nickname = event.target.textContent;
            getColumnData(nickname);
            boxplot.style.height = '30vw';
            if (boxplot.style.height === '30vw') {
                let chart;
                drawBasicData(nickname);
            }
        }
    }));
}

loadCombinedData();