import pandas as pd
import numpy as np
from typing import Literal, Any


DAY_DICT = {'星期一': 1, '星期二': 2, '星期三': 3,
            '星期四': 4, '星期五': 5, '星期六': 6, '星期日': 7}
NF_TUPLE = (12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23)
XQ_DICT = {12: (2, 3), 13: (1, 2, 3), 14: (1, 2, 3), 15: (1, 2, 3), 16: (1, 2, 3), 17: (
    1, 2, 3), 18: (1, 2, 3), 19: (1, 2, 3), 20: (1, 2, 3), 21: (1, 2, 3), 22: (1, 2, 3), 23: (1,)}


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

        if ke1.zzz == 0 or ke2.zzz == 0:
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

        3:课1完全被课2撞, 反之非

        4:课2完全被课1撞, 反之非
        '''

        if not data.is_qzz_cover(ke1, ke2):
            return 0  # 如果起止周不重合肯定不冲

        b10: bool = True  # 完全不冲
        b11: bool = True  # 完全冲掉
        # 课1的所有时间跟课2什么关系？课1被冲了吗？
        for sj1 in ke1.sksj:
            if sj1 in ke2.sksj:
                b10 = False  # 一旦课1的某个时段在课2里，说明不可能不被课2冲
            else:
                b11 = False  # 一旦课1的某个时段不在课2里，说明不可能完全被课2冲

        if b10:
            return 0  # 如果相互不撞课

        b20: bool = True
        b21: bool = True
        # 课2的所有时间跟课1什么关系？课2被冲了吗？
        for sj2 in ke2.sksj:
            if sj2 in ke1.sksj:
                b20 = False  # 一旦课2的某个时段在课1里，说明不可能不被课1冲
            else:
                b21 = False  # 一旦课2的某个时段不在课1里，说明不可能完全被课1冲

        if b11 and b21:
            return 2  # 如果相互都完全冲
        if not b11 and not b21:
            return 1  # 如果相互都不是完全冲，说明二者交错
        if b11:
            return 3  # 剩下只可能一个课被另一个包含
        return 4

    @staticmethod
    def parse_day_time(daytime: str) -> tuple[int, int, int]:
        '''
        '星期一(第3节-第4节)' -> (1, 3, 4)
        '''

        sjsplit = daytime.split('节-第')
        return (DAY_DICT[daytime.split('(')[0]], int(sjsplit[0][-1]), int(sjsplit[-1][0]))

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
    def soft_find_teacher(df: pd.DataFrame, keyword: str) -> np.ndarray:
        '''
        avoid forgetting teacher's name, especially for foreign teachers......
        '''
        teachers=[]
        for x in data.column_list_unique(df, 'teacher'):
            if keyword in x:
                teachers.append(x)
        return np.array(teachers,dtype=np.object_)
