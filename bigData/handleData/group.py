from non_empty import non_empty_dataframes
from groupby import grouped_dataframes
import matplotlib.pyplot as plt
import seaborn as sns

results = {}

i = 6
for df in non_empty_dataframes:
    # 计算前 20% 的选手数量
    top_20_percent_count = int(len(df) * 0.2)
    
    # 获取前 20% 选手的昵称
    top_20_nicknames = df['昵称'].head(top_20_percent_count)
    
    # 获取第 i 届的分组数据
    grouped_df = grouped_dataframes[i-6]
    
    # 统计这些昵称对应的组别总数
    group_counts = grouped_df[grouped_df['昵称'].isin(top_20_nicknames)]['组别'].value_counts()
    
    # 将结果存储到字典中
    results[f'第{i}届'] = group_counts

    i += 1

sns.set(style="whitegrid")

for key, group_counts in results.items():
    # 绘制饼图
    plt.figure(figsize=(8, 6))
    plt.rcParams["font.sans-serif"]=["SimHei"] #设置字体
    plt.rcParams["axes.unicode_minus"]=False #该语句解决图像中的“-”负号的乱码问题
    plt.pie(group_counts, labels=group_counts.index, autopct='%1.1f%%', startangle=140, colors=sns.color_palette("pastel"))
    plt.title(f'{key} 组别占比')
    plt.axis('equal')  # 使饼图为圆形
    plt.savefig(f'bigData/src/{key}_group_pie.png', dpi=300)  # 保存图表
    plt.close()  # 关闭当前图表以释放内存
