import pandas as pd
import numpy as np
from typing import Literal, Any, Tuple, List, Dict
from functools import lru_cache


DAY_DICT = {'星期一': 1, '星期二': 2, '星期三': 3,
            '星期四': 4, '星期五': 5, '星期六': 6, '星期日': 7}
NF_TUPLE = (12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23)
XQ_DICT = {12: (2, 3), 13: (1, 2, 3), 14: (1, 2, 3), 15: (1, 2, 3), 16: (1, 2, 3), 17: (
    1, 2, 3), 18: (1, 2, 3), 19: (1, 2, 3), 20: (1, 2, 3), 21: (1, 2, 3), 22: (1, 2, 3), 23: (1,)}
DS_DICT = {'星': 0, '单': 1, '双': 2}
COLLEGE_DICT = {'': '所有学院', '00001': '数学科学学院', '00003': '力学与工程科学系', '00004': '物理学院', '00010': '化学与分子工程学院', '00011': '生命科学学院', '00012': '地球与空间科学学院', '00016': '心理与认知科学学院', '00017': '软件与微电子学院', '00018': '新闻与传播学院', '00020': '中国语言文学系', '00021': '历史学系', '00022': '考古文博学院', '00023': '哲学系', '00024': '国际关系学院', '00025': '经济学院', '00028': '光华管理学院', '00029': '法学院', '00030': '信息管理系', '00031': '社会学系', '00032': '政府管理学院', '00038': '英语语言文学系', '00039': '外国语学院', '00040': '马克思主义学院', '00041': '体育教研部', '00043': '艺术学院', '00044': '对外汉语教育学院', '00046': '元培学院', '00048': '信息科学技术学院', '00055': '王选计算机研究所',
                '00062': '国家发展研究院', '00067': '教育学院', '00068': '人口研究所', '00084': '前沿交叉学科研究院', '00086': '工学院', '00126': '城市与环境学院', '00127': '环境科学与工程学院', '00182': '分子医学研究所', '00187': '中国社会科学调查中心', '00188': '中国教育财政科学研究所', '00192': '歌剧研究院', '00195': '建筑与景观设计学院', '00199': '产业技术研究院', '00201': '汇丰商学院', '00204': '继续教育学院', '00206': '新媒体研究院', '00207': '海洋研究院', '00211': '现代农学院', '00217': '南南合作与发展学院', '00221': '习近平新时代中国特色社会主义思想研究院', '00225': '人工智能研究院', '00232': '材料科学与工程学院', '00607': '学生工作部人民武装部', '00612': '教务部', '00622': '科技开发部', '00651': '中国共产主义青年团北京大学委员会', '00671': '创新创业学院', '10180': '医学部教学办'}


def safe_trans_int(s: str) -> int:
    try:
        return(int(s))
    except ValueError:
        return 0


class data:

    df: pd.DataFrame

    def __init__(self, df: pd.DataFrame) -> None:
        self.df = df

    @staticmethod
    def is_qzz_cover(ke1: pd.Series, ke2: pd.Series) -> Literal[0, 1]:
        '''
        0:起止周完全不重合

        1:起止周存在重合
        '''

        if (ke1.zzz and ke2.zzz) == 0:
            return 0  # 如果一门课不存在完好的起止周(主要是终止周是第0周)，则认为是灵活课，不会跟任意课程冲突

        if int(ke1.zzz) < int(ke2.qsz) or int(ke2.zzz) < int(ke1.qsz):
            return 0  # iff 前课的最后一周仍然不到后课第一周，不会冲突
        return 1

    @staticmethod
    def is_zhuangke(ke1: pd.Series, ke2: pd.Series) -> Literal[0, 1, 2, 3, 4]:
        '''
        0:不撞课

        1:相互交错，部分撞课

        2:相互完全互撞

        3:课1完全被课2撞, 课2还有课没被课1撞

        4:与3反之
        '''

        if not data.is_qzz_cover(ke1, ke2):
            return 0  # 如果起止周不重合肯定不冲

        if ke1['xq'] != ke2['xq']:
            return 0  # 如果学期不同肯定不冲

        def course_conflict(sj1: tuple, sj2: tuple) -> bool:
            '''
            sj:(a,b,c,d)
            '''
            if sj1[3] and sj2[3]:  # 如果都是单双周
                if sj1[3] != sj2[3]:  # 并且单双不一样
                    return False
            if sj1[0] != sj2[0]:
                return False  # 如果上课星期几不一样，肯定这两段不冲
            if sj1[0] == 0:
                return False  # 如果存在课没有时间安排，认定为不冲
            if sj1[1] > sj2[2] or sj1[2] < sj2[1]:
                return False  # 如果星期几一样，但是两门课不覆盖，说明不冲
            return True

        # 行是课1，列是课2
        conflict_table = np.array(
            [[course_conflict(sj1, sj2) for sj2 in ke2.sksj]for sj1 in ke1.sksj])

        if not conflict_table.any():
            return 0  # 如果不存在撞课

        ke1_was_conf = np.apply_over_axes(
            np.any, conflict_table, 1)  # 课程1的被撞情况，元素个数==课1的时间段数
        ke2_was_conf = np.apply_over_axes(
            np.any, conflict_table, 0)  # 课程2的被撞情况

        if np.all(ke1_was_conf):  # 如果课1全被撞
            if np.all(ke2_was_conf):
                return 2  # 如果二者都全撞
            return 3
        # 如果课1不全被撞
        if np.all(ke2_was_conf):  # 课2全被撞
            return 4
        return 1  # 互相都不全撞

    @staticmethod
    def parse_day_time(daytime: str) -> Tuple[int, int, int, int]:
        '''
        '星期一(第3节-第4节)' -> (1, 3, 4, 0)
        '星期一(第3节-第4节)(单)' -> (1, 3, 4, 1)
        '星期一(第3节-第4节)(双)' -> (1, 3, 4, 2)
        '星期二(第10节-第11节)' -> (2, 10, 11, 0)

        没有设置时间的课程，例如 sksj==[] ，设定其为[(0,0,0,0)]
        '''
        if daytime == '':
            return (0, 0, 0, 0)
        dsmark = DS_DICT[daytime.split(')(')[-1][0]]
        if dsmark:
            daytime = daytime.split(')(')[0]+')'
        sjsplit = daytime.split('节-第')
        return (DAY_DICT[daytime.split('(')[0]], int(
            sjsplit[0][5:]), int(sjsplit[-1][:-2]), dsmark)

    @staticmethod
    def isin_series_list(df: pd.DataFrame, column: Any, element: Any) -> pd.Series:
        '''
        return df[column].apply(lambda lst: element in lst)
        '''
        return df[column].apply(lambda lst: element in lst)

    @staticmethod
    def column_list_unique(df: pd.DataFrame, column: Any) -> np.ndarray:
        '''
        find all element in a series of list.
        '''
        all_lst = []

        def include_lst(all_lst, lst):
            all_lst += lst
        df[column].apply(lambda lst: include_lst(all_lst, lst))
        return pd.Series(all_lst).unique()

    @staticmethod
    def column_list_value_counts(df: pd.DataFrame, column: Any) -> np.ndarray:
        '''
        value count element in a series of list.
        '''
        all_lst = []

        def include_lst(all_lst, lst):
            all_lst += lst
        df[column].apply(lambda lst: include_lst(all_lst, lst))
        return pd.Series(all_lst).value_counts()

    @staticmethod
    def soft_find_teacher(df: pd.DataFrame, keyword: str) -> np.ndarray:
        '''
        avoid forgetting teacher's name, especially for foreign teachers......
        '''
        teachers = []
        for x in data.column_list_unique(df, 'teacher'):
            if keyword in x:
                teachers.append(x)
        return np.array(teachers, dtype=np.object_)

    @staticmethod
    def get_nf_xq_college_slice(df: pd.DataFrame, qsn: int, xq: int, college: str) -> pd.DataFrame:
        '''
        return a slice of df
        '''
        if qsn:
            df = df[df['qsn'] == qsn]
        if xq:
            df = df[df['xq'] == xq]
        if college:
            df = df[df['kkxsmc'] == COLLEGE_DICT[college]]
        return df.copy()

    # TODO
    def course_stable(self, kch: str) -> pd.Series:
        '''课程的稳定性。

        return: 

        '''
        df = self.df
        this_course_df = df[df['kch'] == kch]

    # TODO
    def zhuangke_stat(self, kch: str) -> pd.DataFrame:
        df = self.df
        this_course_df = df[df['kch'] == kch]

    @lru_cache
    def get_heatmap(self, qsn: int, xq: int, college: str) -> List[List[int]]:
        '''
        return a 12*7 array of counts of courses

        12 classtimes per day, 7 days per week.

        index of 12 classtimes is 0 to 11, referring to 1st to 12th class.

        '''
        df = self.df.copy()
        df = data.get_nf_xq_college_slice(df, qsn, xq, college)
        heatmap = np.zeros((12, 7))

        def count_heatmap(course: pd.Series) -> None:
            for sj in course['sksj']:
                if sj[2] != 0:
                    for t in range(max(sj[1] - 1, 0), min(sj[2], 12)):
                        if sj[3] == 0:
                            heatmap[t, sj[0] - 1] += 1
                        else:  # 单双周
                            heatmap[t, sj[0] - 1] += 0.5

        df.apply(count_heatmap, axis=1)

        return heatmap.tolist()

    @lru_cache
    def get_trend(self, college: str) -> Dict[str, int]:
        df = self.df[self.df['college'] == COLLEGE_DICT[college]
                     ] if college else self.df.copy()
        trend = {}
        for sems in df['nfxq'].unique():
            trend[sems] = int((df['nfxq'] == sems).values.sum())
        return dict(sorted(zip(trend.keys(), trend.values())))

    @lru_cache
    def get_typed_courses(self, qsn: int, xq: int, college: str) -> Dict[str, int]:
        df = self.df.copy()
        if qsn:
            df = df[df['qsn'] == qsn]
        if xq:
            df = df[df['xq'] == xq]
        if college:
            df = df[df['kkxsmc'] == COLLEGE_DICT[college]]
        typed_courses = {}
        for atype in df['kctxm'].unique():
            typed_courses[atype] = int((df['kctxm'] == atype).values.sum())
        return dict(sorted(zip(typed_courses.keys(), typed_courses.values())))

    @lru_cache
    def get_weektime_distribution(self, qsn: int, xq: int, college: str) -> dict[float, int]:
        '''
        weektime distributions of courses
        '''
        df = self.df.copy()
        df = data.get_nf_xq_college_slice(df, qsn, xq, college)
        d = {}

        def count_weektime(course: pd.Series) -> None:
            weektime = 0
            for sj in course['sksj']:
                if sj[2] != 0:
                    thistime = sj[2]-sj[1]+1
                    if sj[3] == 0:
                        weektime += thistime
                    else:  # 单双周
                        weektime += thistime/2
            rweektime = round(weektime, 1)
            if not rweektime in d.keys():
                d[rweektime] = 0
            d[rweektime] += 1

        df.apply(count_weektime, axis=1)

        return d
