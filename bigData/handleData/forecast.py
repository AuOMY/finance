from non_empty import non_empty_dataframes
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib

# 设置中文字体
matplotlib.rcParams['font.sans-serif'] = ['SimHei']  # 使用黑体
matplotlib.rcParams['axes.unicode_minus'] = False  # 解决负号显示问题

# 初始化一个空的列表来存储所有数据框
all_data = []

for i in range(len(non_empty_dataframes) - 1):  # 只循环到倒数第二项
    df = non_empty_dataframes[i]
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

    # 将处理后的数据框添加到列表中
    all_data.append(df)

# 合并所有数据框
combined_df = pd.concat(all_data, ignore_index=True)

# 选择特征和目标变量
X = combined_df[indicators]  # 特征变量
y = combined_df.index  # 目标变量（索引）

# 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 初始化并训练随机森林回归模型
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 进行预测
y_pred = model.predict(X_test)

# 评估模型性能
r2 = r2_score(y_test, y_pred)
print(f'R² Score: {r2}')

# 输出预测结果
predictions = pd.DataFrame({'实际排名': y_test, '预测排名': y_pred})

# 可视化预测结果与实际结果
plt.figure(figsize=(12, 6))

# 散点图
plt.subplot(1, 2, 1)
sns.scatterplot(x=y_test, y=y_pred, alpha=0.6)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')  # 绘制y=x线
plt.xlabel('实际排名')
plt.ylabel('预测排名')
plt.title('测试集实际排名与预测排名对比')

# 对比图
plt.subplot(1, 2, 2)
sns.histplot(predictions['实际排名'], color='blue', label='实际排名', kde=True, stat='density', bins=30)
sns.histplot(predictions['预测排名'], color='orange', label='预测排名', kde=True, stat='density', bins=30)
plt.xlabel('排名')
plt.ylabel('密度')
plt.title('测试集实际排名与预测排名分布')
plt.legend()

plt.tight_layout()

# 保存为PNG图片
plt.savefig('bigData/src/forecast.png', dpi=300)  # dpi可以调节图片清晰度
plt.close()  # 关闭图形以释放内存

# 处理 non_empty_dataframes[-1] 进行预测
new_df = non_empty_dataframes[-1]

# 处理新的数据框
for column in indicators:
    if column in new_df.columns:
        new_df[column] = pd.to_numeric(new_df[column].astype(str).str.replace(',', '').str.replace('%', ''), errors='coerce')
        if '率' in column:  # 假设包含'率'的列表示概率
            new_df[column] = new_df[column] / 100

# 选择特征变量
X_new = new_df[indicators]

# 进行预测
new_predictions = model.predict(X_new)

# 创建一个 DataFrame 来存储实际排名和预测排名
new_results = pd.DataFrame({
    '实际排名': new_df.index,  # 或者根据具体情况选择实际排名的列
    '预测排名': new_predictions
})

# 可视化实际排名和预测排名
plt.figure(figsize=(12, 6))

# 使用箱线图展示实际排名与预测排名
plt.subplot(1, 2, 1)
sns.boxplot(data=new_results[['实际排名', '预测排名']])
plt.ylabel('排名')
plt.title('第十六届实际排名与预测排名的箱线图')

# 使用小提琴图展示实际排名与预测排名
plt.subplot(1, 2, 2)
sns.violinplot(data=new_results[['实际排名', '预测排名']], inner="quartile")
plt.ylabel('排名')
plt.title('第十六届实际排名与预测排名的小提琴图')

plt.tight_layout()

# 保存为PNG图片
plt.savefig('bigData/src/new_forecast.png', dpi=300)  # dpi可以调节图片清晰度
plt.close()  # 关闭图形以释放内存