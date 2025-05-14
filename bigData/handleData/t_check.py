from non_empty import non_empty_dataframes
import pandas as pd
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns

best_indicators = {}

i = 6
for df in non_empty_dataframes:
    # 选择需要分析的指标
    indicators = [
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

    if '组别' in df.columns and '昵称' in df.columns:
        df = df.drop(columns=['组别', '昵称'])

    for column in indicators:
        if column in df.columns:
            # 先去掉逗号，再去掉百分号，然后转换为数值类型
            df[column] = pd.to_numeric(df[column].astype(str).str.replace(',', '').str.replace('%', ''), errors='coerce')
            if '率' in column:  # 假设包含'率'的列表示概率
                df[column] = df[column] / 100

    total_count = len(df)
    top_count = int(total_count * 0.2)
    bottom_count = int(total_count * 0.4)

    top_20 = df.head(top_count)
    
    bottom_40 = df.tail(bottom_count)

    t_result = {}

    for indicator in indicators:
        if indicator in top_20.columns and indicator in bottom_40.columns:
            top_data = top_20[indicator].dropna()
            bottom_data = bottom_40[indicator].dropna()

            t_stat, p_value = stats.ttest_ind(top_data, bottom_data, equal_var=False)

            t_result[indicator] = {
                't_static': t_stat,
                'p_value': p_value
            }

    best_indicators[f'第{i}届'] = t_result
    i += 1

# 准备数据
results = []
for session, indicators in best_indicators.items():
    for indicator, values in indicators.items():
        results.append({
            '届数': session,  # 使用 '届数' 作为列名
            '指标': indicator,
            't_statistic': values['t_static'],
            'p_value': values['p_value']
        })

results_df = pd.DataFrame(results)

# 设置图形风格
sns.set(style="whitegrid")

# 创建一个图形对象
plt.figure(figsize=(12, 8))

plt.rcParams["font.sans-serif"]=["SimHei"] #设置字体
plt.rcParams["axes.unicode_minus"]=False #该语句解决图像中的“-”负号的乱码问题

# 绘制条形图，t统计量
sns.barplot(data=results_df, x='p_value', y='指标', hue='届数', dodge=True)

# 添加标题和标签
plt.title('T-检验结果可视化', fontsize=16)
plt.xlabel('P 值', fontsize=14)
plt.ylabel('')
plt.axvline(0, color='grey', linestyle='--')  # 添加一条垂直线，表示 t 统计量为 0 的位置
plt.legend(title='届数')
plt.tight_layout()

# 显示图形
plt.savefig('D:/finance/src/images/t.png', dpi=300)
plt.close()