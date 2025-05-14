import pandas as pd

# 加载 CSV 文件
df = pd.read_csv('bigData\\src\\initLinks.csv')

# 将列转换为列表
columns_lists = {column: df[column].tolist() for column in df.columns}

# 遍历第 6 届到第 13 届的链接
for i in range(6, 14):  # 从第 6 届到第 13 届
    column_name = f'第{i}届链接'
    if column_name in columns_lists:  # 检查列是否存在
        for j, link in enumerate(columns_lists[column_name]):
            # 检查链接是否为空
            if pd.isna(link) or link == '':  # 检查是否为 NaN 或空字符串
                continue  # 如果为空，则跳过当前链接
            
            # 确保链接是字符串类型
            if isinstance(link, float):
                link = str(link)  # 将浮点数转换为字符串
            
            # 修改链接
            modified_link = link.replace('.cn', '.cn:8888').replace('Index', 'BasicData')
            columns_lists[column_name][j] = modified_link  # 更新列表中的链接

# 将修改后的列表转换回 DataFrame
modified_df = pd.DataFrame(columns_lists)

# 保存修改后的 DataFrame 到 newLinks.csv
modified_df.to_csv('bigData\\src\\newLinks.csv', index=False, encoding='utf-8-sig')
