import gzip
import json
import pandas as pd
from bs4 import BeautifulSoup
from functools import lru_cache
from funcs import *


@lru_cache
def getdata() -> pd.DataFrame:
    f = open('database.json.gz', mode='rb')
    database = json.loads(gzip.decompress(f.read()))
    f.close()
    del f
    df = pd.DataFrame()
    for k, v in database.items():
        temp = pd.DataFrame(database[k])
        temp['nfxq'] = k
        del temp['xh']
        df = pd.concat([df, temp])
    df.reset_index(inplace=True)
    del df['index']

    df['sksj'] = df['sksj'].apply(lambda x: BeautifulSoup(
        x, 'html.parser').get_text(',').split(','))
    df['teacher'] = df['teacher'].apply(lambda x: BeautifulSoup(
        x, 'html.parser').get_text(',').split(','))

    temp = df['nfxq'].str.split('-')
    xq = temp.apply(lambda x: int(x[2]))
    qishinian = temp.apply(lambda x: int(x[0]))  # 起始年
    df['xq'] = xq
    df['qsn'] = qishinian
    #del df['nfxq']

    temp = df['qzz'].str.split('-')
    df['qsz'] = temp.apply(lambda x: safe_trans_int(x[0]))
    df['zzz'] = temp.apply(lambda x: safe_trans_int(x[1]))
    del df['qzz']

    df.sksj = df.sksj.apply(lambda lst: [data.parse_day_time(x) for x in lst])

    return df
