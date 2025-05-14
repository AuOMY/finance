from non_empty import non_empty_dataframes
import pandas as pd
from sklearn.cluster import DBSCAN
import matplotlib.pyplot as plt
import seaborn as sns

# 设置图形风格
sns.set(style="whitegrid")

kmeans_results = {}
i = 6

for df in non_empty_dataframes:
    # 选择需要分析的指标
    indicators = [
        '累计净值',
        '累计净利润'
    ]

    if '组别' in df.columns and '昵称' in df.columns:
        df = df.drop(columns=['组别', '昵称'])

    # 转换为数值类型
    for column in indicators:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column].astype(str).str.replace(',', ''), errors='coerce')

    total_count = len(df)
    top_count = int(total_count * 0.2)
    bottom_count = int(total_count * 0.4)

    # 选择前20%的选手
    top_20 = df.head(top_count).copy()
    # 选择后40%的选手
    bottom_40 = df.tail(bottom_count).copy()

    # DBSCAN 聚类
    for group, group_data in zip(['前20%', '后40%'], [top_20, bottom_40]):
        dbscan_data = group_data[indicators].dropna()
        if not dbscan_data.empty and len(dbscan_data) > 1:  # 确保有数据进行聚类
            dbscan = DBSCAN(eps=0.5, min_samples=5)  # 设置 ε 和最小样本数
            group_data['Cluster'] = dbscan.fit_predict(dbscan_data)

    # 合并前20%和后40%的数据以便绘图
    combined_data = pd.concat([top_20.assign(Group='前20%'), bottom_40.assign(Group='后40%')])

    # 可视化聚类结果
    plt.figure(figsize=(10, 6))
    plt.rcParams["font.sans-serif"] = ["SimHei"]  # 设置字体
    plt.rcParams["axes.unicode_minus"] = False  # 解决图像中的“-”负号的乱码问题

    # 绘制聚类结果
    sns.scatterplot(data=combined_data, x='累计净值', y='累计净利润', hue='Group', palette={'前20%': 'blue', '后40%': 'orange'}, s=100, style='Group', markers=['o', 's'])

    plt.title(f'{i}届 DBSCAN 聚类结果')
    plt.xlabel('累计净值')
    plt.ylabel('累计净利润')
    plt.legend(title='组别')
    plt.tight_layout()
    plt.savefig(f'D:/finance/bigData/src/dbscan_results_{i}届.png', dpi=300)
    plt.close()

    i += 1