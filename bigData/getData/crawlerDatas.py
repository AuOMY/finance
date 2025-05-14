import pandas as pd
import aiohttp
import asyncio
import random
from bs4 import BeautifulSoup

# 随机用户代理列表
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
    # 可以添加更多用户代理
]

async def fetch_data(session, nickname, link, semaphore, is_new=True):
    async with semaphore:  # 限制并发请求
        # 检查链接是否为 nan
        if pd.isna(link):
            if is_new:
                return {'昵称': nickname, '组别': None, '组账户数': None, '账户昵称': None, '操作指导': None,
                        '参赛日期': None, '指定交易商': None, '期初权益': None, '期末权益': None,
                        '累计入金': None, '累计出金': None, '综合排名': None, '累计净值': None,
                        '最大回撤率': None, '累计净利润': None, '日收益率均值': None, '历史最大本金': None,
                        '最大本金收益率': None, '日收益率最大': None, '日收益率最小': None,
                        '预计年化收益率': None, '总交易天数': None, '盈利天数': None, '亏损天数': None,
                        '交易胜率': None, '盈亏比': None, '手续费/净利润': None, '风险度均值': None}
            else:
                return {'昵称': nickname, '组别': None, '组账户数': None, '账户昵称': None, '操作指导': None,
                        '参赛日期': None, '指定交易商': None, '期初权益': None, '期末权益': None,
                        '累计入金': None, '累计出金': None, '累计净值': None, '累计净值排名': None,
                        '累计净利润': None, '累计净利润排名': None, '日收益率均值': None,
                        '日收益率最大': None, '日收益率最小': None, '年化收益率': None,
                        '盈利天数': None, '亏损天数': None, '交易胜率': None, '盈亏比': None,
                        '手续费/净利润': None, '风险度均值': None}

        # 发起请求
        retries = 3
        for attempt in range(retries):
            try:
                headers = {'User-Agent': random.choice(USER_AGENTS)}
                async with session.get(link, headers=headers) as response:
                    response.raise_for_status()  # 如果响应状态码不是 200，将引发异常
                    response.encoding = 'utf-8'  # 根据需要设置编码
                    html = await response.text()

                    # 解析网页内容
                    soup = BeautifulSoup(html, 'html.parser')

                    # 存储结果
                    data = {'昵称': nickname}

                    # 根据 is_new 参数选择表头
                    if is_new:
                        headers = ['组别', '组账户数', '账户昵称', '操作指导', '参赛日期', '指定交易商',
                                   '期初权益', '期末权益', '累计入金', '累计出金', '综合排名',
                                   '累计净值', '最大回撤率', '累计净利润', '日收益率均值',
                                   '历史最大本金', '最大本金收益率', '日收益率最大', '日收益率最小',
                                   '预计年化收益率', '总交易天数', '盈利天数', '亏损天数',
                                   '交易胜率', '盈亏比', '手续费/净利润', '风险度均值']
                    else:
                        headers = ['组别', '组账户数', '账户昵称', '操作指导', '参赛日期', '指定交易商',
                                   '期初权益', '期末权益', '累计入金', '累计出金', '累计净值',
                                   '累计净值排名', '累计净利润', '累计净利润排名', '日收益率均值',
                                   '日收益率最大', '日收益率最小', '年化收益率', '盈利天数',
                                   '亏损天数', '交易胜率', '盈亏比', '手续费/净利润', '风险度均值']

                    # 遍历每一行
                    rows = soup.find_all('tr')
                    if not rows:
                        return {**data, **{key: None for key in headers}}

                    for row in rows:
                        cells = row.find_all('td')
                        if len(cells) >= 2:
                            for i, cell in enumerate(cells):
                                if cell.get_text(strip=True) in headers:
                                    if i + 1 < len(cells):
                                        value_cell = cells[i + 1]
                                        value = value_cell.get_text(strip=True)
                                        key = cell.get_text(strip=True)
                                        data[key] = value

                    return data

            except Exception as e:
                await asyncio.sleep(1)  # 等待1秒后重试

        # 请求失败时返回默认值
        if is_new:
            return {'昵称': nickname, '组别': None, '组账户数': None, '账户昵称': None, '操作指导': None,
                    '参赛日期': None, '指定交易商': None, '期初权益': None, '期末权益': None,
                    '累计入金': None, '累计出金': None, '综合排名': None, '累计净值': None,
                    '最大回撤率': None, '累计净利润': None, '日收益率均值': None, '历史最大本金': None,
                    '最大本金收益率': None, '日收益率最大': None, '日收益率最小': None,
                    '预计年化收益率': None, '总交易天数': None, '盈利天数': None, '亏损天数': None,
                    '交易胜率': None, '盈亏比': None, '手续费/净利润': None, '风险度均值': None}
        else:
            return {'昵称': nickname, '组别': None, '组账户数': None, '账户昵称': None, '操作指导': None,
                    '参赛日期': None, '指定交易商': None, '期初权益': None, '期末权益': None,
                    '累计入金': None, '累计出金': None, '累计净值': None, '累计净值排名': None,
                    '累计净利润': None, '累计净利润排名': None, '日收益率均值': None,
                    '日收益率最大': None, '日收益率最小': None, '年化收益率': None,
                    '盈利天数': None, '亏损天数': None, '交易胜率': None, '盈亏比': None,
                    '手续费/净利润': None, '风险度均值': None}

async def main():
    # 读取 CSV 文件
    df = pd.read_csv('bigData\\src\\newLinks.csv')
    columns_lists = {column: df[column].tolist() for column in df.columns}

    semaphore = asyncio.Semaphore(10)  # 限制并发请求的数量

    async with aiohttp.ClientSession() as session:
        for i in range(14, 17):
            tasks = []
            results = []

            # 根据当前的 i 值选择 fetch_data 的调用方式
            is_new = i >= 12  # 如果 i 在 12 到 16 之间，使用新数据结构

            for nickname, link in zip(columns_lists['昵称'], columns_lists.get(f'第{i}届链接', [])):
                task = fetch_data(session, nickname, link, semaphore, is_new=is_new)
                tasks.append(task)

            # 按顺序获取结果
            results = await asyncio.gather(*tasks)

            # 创建 DataFrame 并保存为 CSV 文件
            result_df = pd.DataFrame(results)
            result_df.to_csv(f'bigData\\src\\basic_details_{i}.csv', index=False, encoding='utf-8-sig')

            # 每次爬取完一个文件后随机延迟
            await asyncio.sleep(random.uniform(1, 3))

if __name__ == '__main__':
    asyncio.run(main())