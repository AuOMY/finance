import pandas as pd

init_dataframes = [] # 初始数据集
for i in range(6, 17):
    df = pd.read_csv(f'bigData\\src\\basic_details_{i}.csv')
    init_dataframes.append(df)

# 定义需要检查的列
columns_to_check = [
    '组别', 
    '组账户数',
    '期初权益',
    '期末权益',
    '累计入金',
    '累计出金',
    '累计净值',
    '累计净利润',
    '盈利天数',
    '亏损天数',
    '交易胜率',
    '盈亏比',
    '手续费/净利润'
]

non_empty_dataframes = [] # 非空数据集
for i, df in enumerate(init_dataframes, start=6):
    df = df.dropna(subset=columns_to_check)
    df = df[['昵称'] + columns_to_check]
    non_empty_dataframes.append(df)