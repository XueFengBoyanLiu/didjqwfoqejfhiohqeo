import pandas as pd
import numpy as np
from typing import Literal, Any, Tuple, List, Dict, Callable
from functools import lru_cache


DAY_DICT = {'星期一': 1, '星期二': 2, '星期三': 3,
            '星期四': 4, '星期五': 5, '星期六': 6, '星期日': 7}
DAY_REVERSED_DICT = dict(zip(DAY_DICT.values(), DAY_DICT.keys()))

NUMBER_DICT = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6,
               '七': 7, '八': 8, '九': 9, '十': 10, '十一': 11, '十二': 12}
NUMBER_REVERSED_DICT = dict(zip(NUMBER_DICT.values(), NUMBER_DICT.keys()))

COURSE_TYPE_DICT = dict(zip(list(range(0, 15)), ('专业任选', '专业必修', '专业限选', '体育', '全校公选课', '军事理论', '双学位',
                                                 '大学英语', '实习实践', '思想政治', '文科生必修', '毕业论文/设计', '理科生必修', '辅修', '通选课')))

DS_DICT = {'星': 0, '单': 1, '双': 2}
NF_TUPLE = (12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23)
XQ_TUPLE =(1,2,3)
XQ_DICT = {12: (2, 3), 13: (1, 2, 3), 14: (1, 2, 3), 15: (1, 2, 3), 16: (1, 2, 3), 17: (
    1, 2, 3), 18: (1, 2, 3), 19: (1, 2, 3), 20: (1, 2, 3), 21: (1, 2, 3), 22: (1, 2, 3), 23: (1,)}
XQ_NAME_DICT = {0: '所有', 1: '秋', 2: '春', 3: '夏'}
COLLEGE_DICT = {'': '所有学院', '00001': '数学科学学院', '00003': '力学与工程科学系', '00004': '物理学院', '00010': '化学与分子工程学院', '00011': '生命科学学院', '00012': '地球与空间科学学院', '00016': '心理与认知科学学院', '00017': '软件与微电子学院', '00018': '新闻与传播学院', '00020': '中国语言文学系', '00021': '历史学系', '00022': '考古文博学院', '00023': '哲学系', '00024': '国际关系学院', '00025': '经济学院', '00028': '光华管理学院', '00029': '法学院', '00030': '信息管理系', '00031': '社会学系', '00032': '政府管理学院', '00038': '英语语言文学系', '00039': '外国语学院', '00040': '马克思主义学院', '00041': '体育教研部', '00043': '艺术学院', '00044': '对外汉语教育学院', '00046': '元培学院', '00048': '信息科学技术学院', '00055': '王选计算机研究所',
                '00062': '国家发展研究院', '00067': '教育学院', '00068': '人口研究所', '00084': '前沿交叉学科研究院', '00086': '工学院', '00126': '城市与环境学院', '00127': '环境科学与工程学院', '00182': '分子医学研究所', '00187': '中国社会科学调查中心', '00188': '中国教育财政科学研究所', '00192': '歌剧研究院', '00195': '建筑与景观设计学院', '00199': '产业技术研究院', '00201': '汇丰商学院', '00204': '继续教育学院', '00206': '新媒体研究院', '00207': '海洋研究院', '00211': '现代农学院', '00217': '南南合作与发展学院', '00221': '习近平新时代中国特色社会主义思想研究院', '00225': '人工智能研究院', '00232': '材料科学与工程学院', '00607': '学生工作部人民武装部', '00612': '教务部', '00622': '科技开发部', '00651': '中国共产主义青年团北京大学委员会', '00671': '创新创业学院', '10180': '医学部教学办'}


def safe_trans_int(s: str) -> int:
    try:
        return(int(s))
    except ValueError:
        return 0


def get_nfxq_UI_text() -> dict[str, str]:
    '''
    return: {'12-13-2':'2013 春','13-14-1':'2013 秋',...}
    '''
    d = {}
    for nf in NF_TUPLE:
        xqs = XQ_DICT[nf]
        for xq in xqs:
            if xq == 1:
                d[f'{nf}-{nf+1}-{xq}'] = f'{nf+2000} {XQ_NAME_DICT[xq]}'
            else:
                d[f'{nf}-{nf+1}-{xq}'] = f'{nf+2001} {XQ_NAME_DICT[xq]}'
    return d

# delete this when all finished


def lru_cache(anyany: Callable) -> Callable:
    return anyany


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
        try:
            if (ke1.zzz and ke2.zzz) == 0:
                return 0  # 如果一门课不存在完好的起止周(主要是终止周是第0周)，则认为是灵活课，不会跟任意课程冲突

            if int(ke1.zzz) < int(ke2.qsz) or int(ke2.zzz) < int(ke1.qsz):
                return 0  # iff 前课的最后一周仍然不到后课第一周，不会冲突
        except AttributeError:
            print(ke1)
            print(ke2)
            raise(AttributeError)
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
    def get_nf_xq_college_slice(df: pd.DataFrame, nf: int | List[int], xq: int | List[int], college: str | List[str]) -> pd.DataFrame:
        '''
        return a slice of df. Params: college:id
        '''
        if nf:
            if type(nf) == int:
                df = df[df['qsn'] == nf]
            if type(nf) == list:
                df = (df[df['qsn']<=max(*nf)])[df['qsn']>=min(*nf)]
        if xq:
            if type(xq) == int:
                df = df[df['xq'] == xq]
            if type(xq) == list:
                for one_xq in XQ_TUPLE:
                    if one_xq not in xq:
                        df=df[df['xq']!=one_xq]
        if college:
            if type(college) == str:
                df = df[df['kkxsmc'] == COLLEGE_DICT[college]]
            if type(college) == list:
                for one_col in COLLEGE_DICT.keys():
                    if one_col not in college:
                        df=df[df['kkxsmc']!=one_col]
        return df.copy()

    # TODO
    def course_stable(self, kch: str) -> pd.Series:
        '''课程的稳定性。

        return: 

        '''
        df = self.df
        this_course_df = df[df['kch'] == kch]

    @lru_cache
    def get_heatmap(self, nf: int | List[int], xq: int | List[int], college: str | List[str]) -> List[List[int]]:
        '''
        return a len of 12*7 = 84 1-d list of counts of courses

        (12 classtimes per day, 7 days per week)

        return: [{group:星期一,variable:第一节,value:132},...]
        '''
        df = self.df.copy()
        df = data.get_nf_xq_college_slice(df, nf, xq, college)
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

        ret_list = []
        for day in range(1, 8):
            for classtime in range(1, 13):
                ret_list.append(
                    {'group': DAY_REVERSED_DICT[day], 'variable': f'第{NUMBER_REVERSED_DICT[classtime]}节', 'value': heatmap[classtime-1, day-1]})
        return ret_list

    @lru_cache
    def get_trend(self, college: str) -> List[Dict]:
        df = self.df[self.df['kkxsmc'] == COLLEGE_DICT[college]
                     ] if college else self.df.copy()
        trend = {}
        for sems in get_nfxq_UI_text().keys():
            trend[sems] = safe_trans_int((df['nfxq'] == sems).values.sum())
        trend = dict(sorted(zip(trend.keys(), trend.values())))
        ret = []
        nfxq_UI_text = get_nfxq_UI_text()
        for key, value in trend.items():
            ret.append({'semester': nfxq_UI_text[key], 'count': value})
        return ret

    # @lru_cache    这个加了会报错！！！不知原因
    def get_typed_courses_with_types(self, nf: int | List[int], xq: int | List[int], college: str | List[str], types: List[int]) -> Dict[str, int]:
        origin_typed_courses = self.get_typed_courses(nf, xq, college)
        ret_d = {}
        for x in types:
            ret_d[COURSE_TYPE_DICT[x]] = origin_typed_courses[COURSE_TYPE_DICT[x]]
        return ret_d

    @lru_cache
    def get_typed_courses(self, nf: int | List[int], xq: int | List[int], college: str | List[str]) -> Dict[str, int]:
        df = self.df.copy()
        df = data.get_nf_xq_college_slice(df, nf, xq, college)
        typed_courses = dict(
            zip(COURSE_TYPE_DICT.values(), np.zeros(len(COURSE_TYPE_DICT))))

        for c_type in df['kctxm'].unique():
            typed_courses[c_type] = int((df['kctxm'] == c_type).values.sum())

        return typed_courses

    @lru_cache
    def get_weektime_distribution(self, nf: int | List[int], xq: int | List[int], college: str | List[str]) -> List[Dict[str, int]]:
        '''
        weektime distributions of courses
        '''
        df = self.df.copy()
        df = data.get_nf_xq_college_slice(df, nf, xq, college)
        ret_lst = []

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
            ret_lst.append({'weektime': rweektime})

        df.apply(count_weektime, axis=1)

        return ret_lst

    def zhuangke(self, kch: str) -> Tuple[List[Dict[str, str]], List[Dict[str, str]]]:
        # 此处对课程进行切片限定
        df = self.df

        return data.zhuangke_stat(df, kch)

    @staticmethod
    def zhuangke_stat(df: pd.DataFrame, kch: str, sth: Any) -> Tuple[List[Dict[str, str]], List[Dict[str, str]]]:
        '''
        ### 不同学期，一定会重复计数

        ### 在同一个学期，同课号的课，考虑重复计数的是时间段

        例如，关注的课是: A课 1班 周一1-4, A课 2班 周一1-4

        eg.1: B课 1班 周一12, B课 2班 周一12

        > 计数1次冲课, return 4

        eg.2: C课 1班 周一12, C课 2班 周一34

        > 计数2次冲课, 两次 return 4

        eg.3: D课 1班 周一1-4, D课 2班 周二1-4

        > 计数1次冲课, return 2

        ### 如果关注的课不同班号有两个时段，则重复计数

        例如，关注的课是: A课 1班 周一1-4, A课 2班 周二1-4

        eg.1: B课 1班 周一12, B课 2班 周一12

        > 计数1次冲课, return 4

        eg.2: E课 1班 周一12, E课 2班 周二34

        > 计数2次冲课, 两次 return 4

        eg.3: D课 1班 周一1-4, D课 2班 周二1-4

        > 计数2次冲课, 两次 return 2
        '''

        # params
        # node id, group 都需要唯一性
        NODE_ID = 'kcmc'
        NODE_GROUP = 'kctxm'
        POINTS_DICT = {1: 3, 2: 5, 3: 4, 4: 4}

        this_course_df = df[df['kch'] == kch].copy()
        otherwise_df = df[df['kch'] != kch].copy()

        nodes = [{'id': this_course_df.loc[1][NODE_ID],
                  'group':this_course_df.loc[1][NODE_GROUP]}]
        links = []
        zhuanged_kch: List[str] = []
        zhuanged_node: Dict[str, Dict[str, str]] = {}
        zhuanged_points: Dict[str, int] = {}
        zhuanged_sksj: Dict[str, List[Tuple]] = {}

        # please apply on dataframe within one year and one semester
        def iter_course(this_course: pd.Series, course: pd.Series) -> None:
            if (zhuangke_code := data.is_zhuangke(this_course, course)):
                if not course['kch'] in zhuanged_kch:
                    zhuanged_kch.append(course['kch'])
                    zhuanged_node[course['kch']] = {
                        'id': course[NODE_ID], 'group': course[NODE_GROUP]}
                    zhuanged_points[course['kch']] = POINTS_DICT[zhuangke_code]
                    zhuanged_sksj[course['kch']] = [tuple(course['sksj'])]
                else:
                    # 如果课号之前有过撞课，看看是不是同一时间，如果不是再算.
                    if not (one_sksj := tuple(course['sksj'])) in zhuanged_sksj[course['kch']]:
                        zhuanged_sksj[course['kch']].append(one_sksj)
                        zhuanged_points[course['kch']
                                        ] += POINTS_DICT[zhuangke_code]

        for nfxq in this_course_df.nfxq.unique():
            this_course_nfxq = this_course_df[this_course_df['nfxq'] == nfxq]
            otherwise_nfxq = otherwise_df[otherwise_df['nfxq'] == nfxq]

            this_sksj_lst = []
            for ind, this_course_row in this_course_nfxq.iterrows():
                if not (this_sksj := list(this_course_row['sksj'])) in this_sksj_lst:
                    this_sksj_lst.append(this_sksj)
                    otherwise_nfxq.apply(lambda x: iter_course(
                        this_course_row, x), axis=1)

            # 每学期结束时刷新时间
            zhuanged_sksj = dict(
                zip((l := zhuanged_sksj.keys()), [[] for _ in range(len(l))]))

        for one_kch in zhuanged_kch:
            nodes.append(zhuanged_node[one_kch])
            links.append(
                {'source': this_course_df.loc[1][NODE_ID], 'target': zhuanged_node[one_kch]['id'], 'value': zhuanged_points[one_kch]})
        return nodes, links
