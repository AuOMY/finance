from non_empty import non_empty_dataframes

grouped_dataframes = []  # 分组数据集

for df in non_empty_dataframes:
    # 将索引重置为列
    df_reset = df.reset_index()
    # 按 '组别' 和 'index' 列排序
    grouped_df = df_reset.sort_values(by=['组别', 'index'], ascending=[True, True])
    # 将索引恢复
    grouped_df.set_index('index', inplace=True)
    grouped_dataframes.append(grouped_df)