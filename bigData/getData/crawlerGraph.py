import pandas as pd
import requests
from bs4 import BeautifulSoup
import json
import re

def extract_basicdata1Curves(url):
    try:
        if pd.isna(url):
            return None

        # 发送请求获取网页内容
        response = requests.get(url)
        response.raise_for_status()  # 检查请求是否成功
        response.encoding = 'utf-8'

        # 解析网页内容
        soup = BeautifulSoup(response.text, 'html.parser')

        # 查找所有 script 标签
        scripts = soup.find_all('script')

        # 提取 basicdata1Curves
        for script in scripts:
            if script.string:  # 确保 script 标签中有内容
                # 使用正则表达式查找 basicdata1Curves 定义
                match = re.search(r'var\s+basicdata1Curves\s*=\s*\'(\[[\s\S]*?)\';', script.string)
                if match:
                    # 提取 JSON 字符串
                    json_str = match.group(1)
                    # 尝试解析 JSON 数据
                    try:
                        data = json.loads(json_str)
                        return data  # 返回提取的数据
                    except json.JSONDecodeError:
                        return None
    except Exception as e:
        return None

def main():
    # 读取 CSV 文件
    df = pd.read_csv('bigData\\src\\newLinks.csv')

    # 遍历每一列链接
    for i in range(14, 17):
        results = pd.DataFrame()  # 每个链接列创建一个新的 DataFrame
        urls = df.get(f'第{i}届链接', pd.DataFrame())  # 使用 df.get 获取链接列

        for index, url in enumerate(urls):
            data = extract_basicdata1Curves(url)  # 获取当前列的 URL
            if data is not None:
                data = pd.DataFrame(data)
                data.rename(columns={
                    'cumulativenet': '净值',
                    'grossprofit': '毛利润',
                    'handingfee': '手续费',
                    'netprofit': '净利润',
                    'playerid': '用户ID',
                    'profitrate': '利润率',
                    'spprofitrate': '最大本金收益率',
                    "tradedate": '交易日期'
                }, inplace=True)
                data.insert(0, '昵称', df['昵称'][index])
                results = pd.concat([results, data], ignore_index=True)
                results = pd.concat([results, pd.DataFrame([{}])], ignore_index=True)

        # 保存每一届的结果到 CSV 文件
        output_file = f'bigData\\src\\graph_datails_{i}.csv'
        results.to_csv(output_file, index=False, encoding='utf-8-sig')

if __name__ == "__main__":
    main()