from non_empty import non_empty_dataframes
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

# 获取最新的数据
latest_data = non_empty_dataframes[-3:]
latest_data = [df.head(10)['昵称'] for df in latest_data]

# 定义文件路径
base_path = r'bigData/src/graph_datails_'
file_names = ['14.csv', '15.csv', '16.csv']

# 读取 CSV 文件并存储在字典中
data_14 = {}
data_15 = {}
data_16 = {}

# 读取 CSV 文件并过滤
for i, file_name in enumerate(file_names):
    df = pd.read_csv(base_path + file_name)
    for nickname in latest_data[i]:
        # 过滤出对应昵称的数据
        filtered_df = df[df['昵称'] == nickname].copy()  # 使用 .copy() 创建副本
        
        # 确保交易日期是日期格式
        filtered_df.loc[:, '交易日期'] = pd.to_datetime(filtered_df['交易日期'])
        
        if file_name == '14.csv':
            data_14[nickname] = filtered_df
        elif file_name == '15.csv':
            data_15[nickname] = filtered_df
        elif file_name == '16.csv':
            data_16[nickname] = filtered_df

# 可视化并保存图像
for i, (file_name, data_dict) in enumerate(zip(file_names, [data_14, data_15, data_16]), start=14):
    for nickname, filtered_df in data_dict.items():
        plt.figure(figsize=(14, 10))
        plt.rcParams["font.sans-serif"] = ["SimHei"]  # 设置字体
        plt.rcParams["axes.unicode_minus"] = False  # 解决图像中的“-”负号的乱码问题
        
        # 绘制图表，调整散点大小
        plt.plot(filtered_df['交易日期'], filtered_df['净值'], label='净值', linewidth=3)
        plt.plot(filtered_df['交易日期'], filtered_df['毛利润'], label='毛利润', linewidth=3)
        plt.plot(filtered_df['交易日期'], filtered_df['手续费'], label='手续费', linewidth=3)
        plt.plot(filtered_df['交易日期'], filtered_df['净利润'], label='净利润', linewidth=3)
        plt.plot(filtered_df['交易日期'], filtered_df['利润率'], label='利润率', linewidth=3)
        plt.plot(filtered_df['交易日期'], filtered_df['最大本金收益率'], label='最大本金收益率', linewidth=3)

        # 设置图表标题和标签
        plt.title(f'{nickname} 数据可视化 ({file_name})')
        plt.xlabel('交易日期')
        plt.ylabel('值')
        plt.legend()

        # 设置X轴日期格式和刻度
        plt.xticks(rotation=45)  # 旋转X轴标签
        plt.gca().xaxis.set_major_locator(mdates.DayLocator(interval=5))  # 每5天一个刻度
        plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))  # 设置日期格式

        # 保存图像
        plt.savefig(f'bigData/src/graph_{i}_{nickname}.png')
        plt.close()  # 关闭当前图形以释放内存