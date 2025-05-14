function showData(initLinks, newLinks, match_details_6, match_details_7, match_details_8, match_details_9, match_details_10, match_details_11, match_details_12, match_details_13, match_details_14, match_details_15, match_details_16) {
    const dropdownContent = document.querySelector('.dropdown-content-csv');
    const description = document.querySelector('.mainBox-description');
    const output = document.querySelector('#output-csv');
    const paginationContainer = document.querySelector('.pagination-container');
    const itemsPerPage = 40; // 每页显示的条目数
    let currentPage = 1; // 当前页码
    let totalPages = 0; // 总页数
    let currentData = []; // 当前页的数据
    let headers = []; // 表头
    // 点击事件
    dropdownContent.addEventListener('click', function (event) {
        if (event.target.classList.contains('csv-contents')) {
            paginationContainer.classList.remove('hidden');
            const title = document.querySelector('.description-title');
            if (title) {
                title.remove();
            }
            description.insertAdjacentHTML('afterbegin', `<p class="description-title">${event.target.id}</p>`);
            const variableMap = {
                'initLinks': initLinks.default,
                'newLinks': newLinks.default,
                'basic_details_6': match_details_6.default,
                'basic_details_7': match_details_7.default,
                'basic_details_8': match_details_8.default,
                'basic_details_9': match_details_9.default,
                'basic_details_10': match_details_10.default,
                'basic_details_11': match_details_11.default,
                'basic_details_12': match_details_12.default,
                'basic_details_13': match_details_13.default,
                'basic_details_14': match_details_14.default,
                'basic_details_15': match_details_15.default,
                'basic_details_16': match_details_16.default
            };
            const f = variableMap[event.target.id];
            if (f) {
                headers = f[0]; // 获取表头
                const data = f.slice(1); // 获取数据（去掉表头）
                totalPages = Math.ceil(data.length / itemsPerPage); // 计算总页数
                currentPage = 1; // 重置为第一页
                currentData = data; // 保存当前数据
                renderTable(); // 渲染表格
                renderPagination(); // 渲染分页
            }
        }
    });
    // 表头
    function renderTable() {
        const fragment = document.createDocumentFragment();
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        // 渲染表头
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow)
        fragment.appendChild(thead);

        const tbody = document.createElement('tbody');
        const start = (currentPage - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, currentData.length);
        const paginatedData = currentData.slice(start, end); // 获取当前页的数据

        paginatedData.forEach((row) => {
            const tr = document.createElement('tr');
            row.forEach((cell) => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        fragment.appendChild(tbody);
        output.innerHTML = ''; // 清空现有内容
        output.appendChild(fragment);
    }
    // 分页
    function renderPagination() {
        paginationContainer.innerHTML = ''; // 清空现有分页内容

        const prevButton = document.createElement('button');
        prevButton.textContent = '上一页';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
                renderPagination();
            }
        });
        paginationContainer.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;
        paginationContainer.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = '下一页';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
                renderPagination();
            }
        });
        paginationContainer.appendChild(nextButton);

        const jumpInput = document.createElement('input');
        jumpInput.type = 'number';
        jumpInput.min = 1;
        jumpInput.max = totalPages;
        jumpInput.value = currentPage; // 默认值为当前页码
        jumpInput.placeholder = '跳转到页码';
        paginationContainer.appendChild(jumpInput);

        const jumpButton = document.createElement('button');
        jumpButton.textContent = '跳转';
        jumpButton.addEventListener('click', () => {
            const targetPage = parseInt(jumpInput.value);
            if (targetPage >= 1 && targetPage <= totalPages) {
                currentPage = targetPage;
                renderTable();
                renderPagination();
            } else {
                alert(`请输入有效的页码（1 - ${totalPages}）`);
            }
        });
        paginationContainer.appendChild(jumpButton);
    }
}

async function loadCSVFiles() {
    // 动态导入 CSV 文件
    const initLinks = await import(/* webpackChunkName: "initLinks" */ '../../bigData/src/initLinks.csv');
    const newLinks = await import(/* webpackChunkName: "newLinks" */ '../../bigData/src/newLinks.csv');
    const matchDetails = await Promise.all([
        import(/* webpackChunkName: "basic_details_6" */ '../../bigData/src/basic_details_6.csv'),
        import(/* webpackChunkName: "basic_details_7" */ '../../bigData/src/basic_details_7.csv'),
        import(/* webpackChunkName: "basic_details_8" */ '../../bigData/src/basic_details_8.csv'),
        import(/* webpackChunkName: "basic_details_9" */ '../../bigData/src/basic_details_9.csv'),
        import(/* webpackChunkName: "basic_details_10" */ '../../bigData/src/basic_details_10.csv'),
        import(/* webpackChunkName: "basic_details_11" */ '../../bigData/src/basic_details_11.csv'),
        import(/* webpackChunkName: "basic_details_12" */ '../../bigData/src/basic_details_12.csv'),
        import(/* webpackChunkName: "basic_details_13" */ '../../bigData/src/basic_details_13.csv'),
        import(/* webpackChunkName: "basic_details_14" */ '../../bigData/src/basic_details_14.csv'),
        import(/* webpackChunkName: "basic_details_15" */ '../../bigData/src/basic_details_15.csv'),
        import(/* webpackChunkName: "basic_details_16" */ '../../bigData/src/basic_details_16.csv')
    ]);
    // 将 matchDetails 数组中的每个元素赋值给对应的变量
    const [match_details_6, match_details_7, match_details_8, match_details_9, match_details_10, match_details_11, match_details_12, match_details_13, match_details_14, match_details_15, match_details_16] = matchDetails;
    return [initLinks, newLinks, match_details_6, match_details_7, match_details_8, match_details_9, match_details_10, match_details_11, match_details_12, match_details_13, match_details_14, match_details_15, match_details_16];
}

const [initLinks, newLinks, match_details_6, match_details_7, match_details_8, match_details_9, match_details_10, match_details_11, match_details_12, match_details_13, match_details_14, match_details_15, match_details_16] = await loadCSVFiles();
showData(initLinks, newLinks, match_details_6, match_details_7, match_details_8, match_details_9, match_details_10, match_details_11, match_details_12, match_details_13, match_details_14, match_details_15, match_details_16);

export { loadCSVFiles };