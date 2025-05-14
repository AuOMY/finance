import requests
from bs4 import BeautifulSoup
import csv
import concurrent.futures

# 基础URL和页码的格式
base_url = 'https://spdsapp.qhrb.com.cn/spds16/match/inner/steadyprofit1.action?page.pageNo={}'

# 存储结果的列表
results = []
# 存储已经处理过的链接
processed_links = set()

# 定义请求处理函数
def fetch_page(page):
    url = base_url.format(page)
    response = requests.get(url)
    response.encoding = 'utf-8'  # 根据实际情况设置编码
    html_content = response.text
    soup = BeautifulSoup(html_content, 'html.parser')

    # 找到表格的tbody部分
    tbody = soup.find('tbody')
    page_results = []

    # 遍历每一行
    for row in tbody.find_all('tr'):
        cells = row.find_all('td')
        if len(cells) > 0:
            # 提取信息
            rank = cells[0].text.strip()  # 排名
            nickname = cells[1].text.strip()  # 昵称
            company = cells[2].text.strip()  # 所属公司
            total_score = cells[3].text.strip()  # 总得分

            # 提取每一届的详细链接
            participation_links = []
            for i in range(4, len(cells), 3):
                participation_status = cells[i].text.strip()  # 是否参赛
                if participation_status == "参赛":
                    detail_link = cells[i + 1].find('a')['href'] if cells[i + 1].find('a') else None
                    if detail_link and detail_link not in processed_links:
                        processed_links.add(detail_link)  # 添加到已处理链接集合
                    else:
                        detail_link = None  # 如果链接已经处理过，则赋值为None
                else:
                    detail_link = None  # 如果未参赛，链接赋值为None
                
                participation_links.append(detail_link)

            # 将提取的数据添加到结果列表
            page_results.append({
                'rank': rank,
                'nickname': nickname,
                'company': company,
                'total_score': total_score,
                'links': participation_links  # 存储所有链接
            })
    
    return page_results

# 设置要爬取的页码范围
total_pages = 290  # 总页数为290

# 使用线程池进行并发请求
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    future_to_page = {executor.submit(fetch_page, page): page for page in range(1, total_pages + 1)}
    for future in concurrent.futures.as_completed(future_to_page):
        page_results = future.result()
        results.extend(page_results)

# 按排名排序
results.sort(key=lambda x: int(x['rank']))

# 写入CSV文件
csv_filename = 'bigData\\src\\initLinks.csv'
with open(csv_filename, mode='w', newline='', encoding='utf-8-sig') as csvfile:
    # 定义CSV表头
    fieldnames = ['排名', '昵称', '所属公司', '总得分'] + [f'第{i}届链接' for i in range(6, 17)]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()  # 写入表头

    # 写入每一行数据
    for result in results:
        row = {
            '排名': result['rank'],
            '昵称': result['nickname'],
            '所属公司': result['company'],
            '总得分': result['total_score'],
        }
        # 填充第六届到第十六届的链接
        for i in range(6, 17):
            index = len(result['links']) - (i - 6) - 2  # 计算反向索引
            row[f'第{i}届链接'] = result['links'][index] if index >= 0 else 'NULL'

        writer.writerow(row)

print(f"数据已成功写入 {csv_filename} 文件。")
