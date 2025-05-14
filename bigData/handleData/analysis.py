from non_empty import columns_to_check, non_empty_dataframes
import pandas as pd

# 合并所有非空数据集
combined_df = pd.concat(non_empty_dataframes, ignore_index=True)

# 将所有相关列转换为数值类型
for column in columns_to_check:
    if column != '昵称' and column != '组别':
        # 先去掉逗号，再去掉百分号，然后转换为数值类型
        combined_df[column] = pd.to_numeric(combined_df[column].astype(str).str.replace(',', '').str.replace('%', ''), errors='coerce')
        if '率' in column:  # 假设包含'率'的列表示概率
            combined_df[column] = combined_df[column] / 100

combined_df.sort_values('昵称').to_csv('bigData\\src\\combined_data.csv', encoding='utf-8-sig', index=False)

def fun(dataSet, choice):
    # 统计每个昵称的出现次数
    dataSet['参加届数'] = dataSet.groupby('昵称')['昵称'].transform('count')
    
    ele = dataSet.groupby('昵称').agg({
        '组账户数': choice,
        '期初权益': choice,
        '期末权益': choice,
        '累计入金': choice,
        '累计出金': choice,
        '累计净值': choice,
        '累计净利润': choice,
        '盈利天数': choice,
        '亏损天数': choice,
        '交易胜率': choice,
        '盈亏比': choice,
        '手续费/净利润': choice,
        '参加届数': 'first'  # 取第一个出现的参加届数
    }).reset_index()

    return ele

grouped_means = fun(combined_df, 'mean')
grouped_median = fun(combined_df, 'median')
grouped_max = fun(combined_df, 'max')
grouped_min = fun(combined_df, 'min')

# 保存结果到 CSV 文件
grouped_means.to_csv('bigData\\src\\grouped_means.csv', encoding='utf-8-sig', index=False)
grouped_median.to_csv('bigData\\src\\grouped_median.csv', encoding='utf-8-sig', index=False)
grouped_max.to_csv('bigData\\src\\grouped_max.csv', encoding='utf-8-sig', index=False)
grouped_min.to_csv('bigData\\src\\grouped_min.csv', encoding='utf-8-sig', index=False)