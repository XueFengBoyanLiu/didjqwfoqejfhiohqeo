import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib 
import matplotlib.cm as cm
import colorsys
from pprint import pprint
import json
from collections import OrderedDict

matplotlib.rc("font",family='YouYuan')
data = pd.read_pickle('df.pkl')

def get_kcnums_rank(data, qsn, xq):
    
    # 分别得到不同年份对应的dataframe，0-11 --> 2012-2023
    qsn_groups = data.groupby(['qsn'])
    divided_by_year = []
    for year in sorted(data['qsn'].unique()):
        divided_by_year.append(qsn_groups.get_group(year))
    
    middle_df = divided_by_year[qsn-12]

    # 得到不同学期对应的dataframe，1-3 --> 1-3学期
    xq_groups = middle_df.groupby(['xq'])
    final_df = xq_groups.get_group(xq)
    # display(final_df.head())

    # 得到不同学院在该学年学期的课程数
    kkxsmc_groups = final_df.groupby(['kkxsmc'])
    kkxsmc_size = kkxsmc_groups.size()

    # 得到不同学院的课程数排名
    kkxsmc_rank = kkxsmc_size.sort_values(ascending=False)

    # kkxsmc_rank = kkxsmc_rank[:15]

    return kkxsmc_rank




    # colors = cm.rainbow(np.linspace(0, 1, 15))
    # for i, color in enumerate(colors):
    #     r, g, b = color[0:3]
    #     h, s, v = colorsys.rgb_to_hsv(r, g, b)
    #     s = 0.7
    #     v = 0.7
    #     rgb = colorsys.hsv_to_rgb(h, s, v)
    #     color = np.concatenate((rgb, [1]))
    #     colors[i] = color

    # fig, ax = plt.subplots(figsize=(10, 8))
    # ax.barh(kkxsmc_rank.index, kkxsmc_rank.values, color=colors)

    # for i, v in enumerate(kkxsmc_rank.values):
    #     ax.text(v + 3, i-0.2, str(v), color=colors[i], fontweight='extra bold', fontsize=12)

    # plt.title(f'20{qsn}-20{qsn+1}学年第{xq}学期各学院课程数排名', fontsize=20, fontweight='bold')
    # plt.xlabel('课程数', fontsize=15, fontweight='bold')
    # plt.ylabel('学院', fontsize=15, fontweight='bold')

    # plt.tight_layout()
    # plt.savefig(f'{qsn}_{xq}.png')
    
    # plt.show()


if __name__ == '__main__':
    year_xq = {x: [y for y in range(1, 4)] for x in range(12, 24)}
    year_xq[12] = [2, 3]
    year_xq[23] = [1]
    print(year_xq)

    # a = get_kcnums_rank(data, 12, 2)
    # print(a.index)
    # print(a.values)
    # print(a)

    to_json = OrderedDict()

    for year in year_xq:
        for xq in year_xq[year]:
            print(year, xq)
            ranked_series = get_kcnums_rank(data, year, xq)
            print(123, ranked_series)
            ranked = OrderedDict()
            ranked = {yuanxi: int(ranked_series[yuanxi]) for yuanxi in ranked_series.index}
            to_json[f'{year}_{xq}'] = ranked
            ranked = {}

    pprint(to_json)
    
    b = json.dumps(to_json, ensure_ascii=False)
    f2 = open('courses_num_byyear.json', 'w', encoding='utf-8')
    f2.write(b)
    f2.close()

    yuanxi_groups = data.groupby(['kkxsmc', 'qsn', 'xq'])
    yuanxi_courses_num = yuanxi_groups.size()
    yuanxi_courses_num.index
    to_json = {yuanxi: {} for yuanxi in data['kkxsmc'].unique()}
    for i in range(len(yuanxi_courses_num)):
        yuanxi = yuanxi_courses_num.index[i][0]
        xqstr = f'{yuanxi_courses_num.index[i][1]}_{yuanxi_courses_num.index[i][2]}'
        to_json[yuanxi][xqstr] = int(yuanxi_courses_num[yuanxi_courses_num.index[i]])
    
    b = json.dumps(to_json, ensure_ascii=False)
    f2 = open('courses_num_byxy.json', 'w', encoding='utf-8')
    f2.write(b)
    f2.close()