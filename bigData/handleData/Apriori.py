from non_empty import non_empty_dataframes
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
import matplotlib.pyplot as plt
import seaborn as sns

# 初始化字典来存储频繁项集和相关规则的计数
frequent_itemset_counts = {}
relevant_rule_counts = {}

for df in non_empty_dataframes:
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

    # 删除不需要的列
    if '组别' in df.columns and '昵称' in df.columns:
        df = df.drop(columns=['组别', '昵称'])

    # 数据清洗
    for column in indicators:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column].astype(str).str.replace(',', '').str.replace('%', ''), errors='coerce')
            if '率' in column:  # 假设包含'率'的列表示概率
                df[column] = df[column] / 100

    # 选出前20%的选手
    total_count = len(df)
    top_count = int(total_count * 0.2)
    top_20 = df.head(top_count)

    # 将所需的指标转换为布尔值，以便进行关联规则挖掘
    features = top_20[indicators].copy()

    # 计算均值并进行布尔化处理
    for column in indicators:
        if column in features.columns:
            mean_value = features[column].mean()
            if column in ['亏损天数', '累计出金', '手续费/净利润']:
                features[column] = (features[column] < mean_value)
            else:
                features[column] = (features[column] >= mean_value)

    # 确保所有列都是布尔类型
    features = features.astype(bool)

    # 计算频繁项集
    frequent_itemsets = apriori(features, min_support=0.1, use_colnames=True)

    # 统计每一种频繁项集的数量
    for index, row in frequent_itemsets.iterrows():
        itemset = frozenset(row['itemsets'])  # 使用 frozenset 作为不可变的集合，确保顺序不影响
        if itemset in frequent_itemset_counts:
            frequent_itemset_counts[itemset] += 1  # 如果存在，加1
        else:
            frequent_itemset_counts[itemset] = 1  # 否则初始化为1

    # 生成关联规则
    rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)

    # 进一步分析与盈利能力最相关的规则
    relevant_rules = rules[(rules['antecedents'].apply(lambda x: '累计净利润' in x or '累计净值' in x)) & (rules['confidence'] > 0.9)].copy()

    # 规则去重并计算平均置信度
    if not relevant_rules.empty:
        # 创建规则集标签
        relevant_rules['rule_set'] = relevant_rules['antecedents'].astype(str) + ' -> ' + relevant_rules['consequents'].astype(str)

        # 统计每一种相关规则的数量
        for index, row in relevant_rules.iterrows():
            rule = (frozenset(row['antecedents']), frozenset(row['consequents']))  # 使用 frozenset 作为不可变的集合
            if rule in relevant_rule_counts:
                relevant_rule_counts[rule] += 1  # 如果存在，加1
            else:
                relevant_rule_counts[rule] = 1  # 否则初始化为1

# 输出频繁项集次数大于1的项并保存
filtered_itemsets = {}  # 使用字典来存储频繁项集及其计数
for itemset, count in frequent_itemset_counts.items():
    if count > 3 and len(itemset) > 1 and ('累计净利润' in itemset or '累计净值' in itemset):
        filtered_itemsets[str(set(itemset))] = count  # 使用字典存储项集和计数

# 将频繁项集保存为 DataFrame
itemset_df = pd.DataFrame(list(filtered_itemsets.items()), columns=['itemset', 'count'])

# 可视化频繁项集
plt.figure(figsize=(10, 6))
plt.rcParams["font.sans-serif"] = ["SimHei"]  # 设置字体
plt.rcParams["axes.unicode_minus"] = False  # 该语句解决图像中的“-”负号的乱码问题
sns.barplot(x='count', y='itemset', data=itemset_df)
plt.title('频繁项集次数')
plt.xlabel('次数')
plt.ylabel('项集')
plt.yticks(fontsize=6)
plt.tight_layout()
plt.savefig('bigData/src/Apriori.png', dpi=300)
plt.close()