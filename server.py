from flask import Flask, request, redirect, url_for, make_response
from typing import Dict, Any, Tuple, List, Sequence
from functools import lru_cache
from data_cleaning import getdata
import pandas as pd
import funcs

app = Flask(__name__)

database: pd.DataFrame = pd.read_pickle('df.pkl')
dataobj = funcs.data(database)


def is_anyone_not_in_list(seq: Sequence, SEQ: Sequence) -> bool:
    return any((one_seq not in SEQ) for one_seq in seq)


def is_exist_but_not_in_list(x: (int | str) | List[(int | str)], SEQ: Sequence) -> bool:
    if x:
        if((type(x) == int or type(x) == str) and x not in SEQ):
            return True
        if(type(x) == list and is_anyone_not_in_list(x, SEQ)):
            return True
    return False


def is_nfxqcol_type_valid(nf: int | List[int], xq: int | List[int], college: str | List[str]) -> bool:
    if ((type(nf) == int or type(nf) == list) and (type(xq) == int or type(xq) == list) and (type(college) == str or type(college) == list)):
        return True
    return False


def is_nfxqcol_range_valid(nf: int | List[int], xq: int | List[int], college: str | List[str]) -> bool:
    if is_exist_but_not_in_list(nf, funcs.NF_TUPLE):
        return False
    if is_exist_but_not_in_list(xq, funcs.XQ_TUPLE):
        return False
    if is_exist_but_not_in_list(college, funcs.COLLEGE_DICT.keys()):
        return False
    return True


def nfxqcol_valid(**kwargs) -> None | Tuple[Dict[str, Any], int]:
    nf: int | List[int] = 0
    xq: int | List[int] = 0
    college: str | List[str] = ''
    valid_keys=['nf','xq','college']
    for k in kwargs.keys():
        if k not in valid_keys:
            return {"success": False, "reason": "unexpected keyword"}, 400
    if 'nf' in kwargs.keys():
        nf = kwargs['nf']
    if 'xq' in kwargs.keys():
        xq = kwargs['xq']
    if 'college' in kwargs.keys():
        college = kwargs['college']
    if not is_nfxqcol_type_valid(nf, xq, college):
        return {"success": False, "reason": "malformed post data"}, 400
    if not is_nfxqcol_range_valid(nf, xq, college):
        return {"success": False, "reason": "invalid range of post data"}, 400
    return


@app.route("/api/teapot")
def api_teapot():
    return "<p>I'm a teapot!</p>", 418


@app.route("/api/test")
def api_test():
    return {"success": True}


@app.route("/api/overview/<sems>")
def api_sems(sems: str):
    '''
    sems:'(12-2)'

    data: json
    '''
    sems = sems.split('-')

    if not ((nf := funcs.safe_trans_int(sems[0]) in funcs.NF_TUPLE) and (xq := funcs.safe_trans_int(sems[1]) in funcs.XQ_DICT[nf])):
        return {'success': False, 'reason': 'invalid sems'}, 404

    # TODO
    data = {}
    return {'success': True, 'sems': data}, 200


@app.route("/api/get_semesters")
def api_get_semesters():
    '''
    data:json
    '''
    return {"success": True, "data": {'NF': list(funcs.NF_TUPLE)}}


@app.route("/api/get_college")
def api_get_college():
    '''
    data:json
    '''
    return {"success": True, "data": funcs.COLLEGE_DICT}


@app.route('/api/get_heatmap', methods=['GET', 'POST'])
def api_get_heatmap():
    '''
    data: 12*7 2d list

    nf: int | List[int]

    xq: int | List[int]

    college: str | List[str]
    '''
    kwargs={}
    if request.method == 'GET':
        pass
    elif request.method == 'POST':
        try:
            kwargs = request.json
            if 'types' in kwargs:
                del kwargs['types']
        except Exception:
            return {"success": False, "reason": "malformed post data"}, 400
        if (message := nfxqcol_valid(**kwargs)):
            return message
    else:
        return {"success": False, "reason": "unsupported http method"}, 503

    return {"success": True, "data": dataobj.get_heatmap(**kwargs)}, 200


@app.route('/api/get_trend', methods=['GET', 'POST'])
def api_get_trend():
    '''
    return a json dict object

    nf: int | List[int]

    xq: int | List[int]

    college: str | List[str]
    '''
    kwargs={}
    if request.method == "GET":
        pass
    elif request.method == "POST":
        try:
            kwargs = request.json
            if 'types' in kwargs:
                del kwargs['types']
        except Exception:
            return {"success": False, "reason": "malformed post data"}, 400
        if (message := nfxqcol_valid(**kwargs)):
            return message
    else:
        return {"success": False, "reason": "unsupported http method"}, 400

    return {"success": True, "data": dataobj.get_trend(**kwargs)}, 200


@app.route('/api/get_typed_courses', methods=['GET', 'POST'])
def api_get_typed_courses():
    '''
    return a json dict object

    nf: int | List[int]

    xq: int | List[int]

    college: str | List[str]
    '''

    types: List[int]
    kwargs={}
    if request.method == 'GET':
        pass
    elif request.method == 'POST':
        try:
            kwargs = request.json
            types=kwargs['types']
            del kwargs['types']
        except Exception:
            return {"success": False, "reason": "malformed post data"}, 400
        if (message := nfxqcol_valid(**kwargs)):
            return message
    else:
        return {"success": False, "reason": "unsupported http method"}, 503
    return {"success": True, "data": dataobj.get_typed_courses_with_types(types,**kwargs)}, 200


@app.route('/api/get_weektime_distribution', methods=['GET', 'POST'])
def api_get_weektime_distribution():
    '''
    return a json dict object

    nf: int | List[int]

    xq: int | List[int]

    college: str | List[str]
    '''
    kwargs={}
    if request.method == 'GET':
        pass
    elif request.method == 'POST':
        try:
            kwargs = request.json
            if 'types' in kwargs:
                del kwargs['types']
        except Exception:
            return {"success": False, "reason": "malformed post data"}, 400
        if (message := nfxqcol_valid(**kwargs)):
            return message
    else:
        return {"success": False, "reason": "unsupported http method"}, 503

    return {"success": True, "data": dataobj.get_weektime_distribution(**kwargs)}, 200


@app.route('/api/conflict', methods=['GET', 'POST'])
def api_conflict():
    '''
    return a json dict object
    '''
    # 可以添加一些限定条件
    if request.method == 'GET':
        return {'success': False, 'reason': 'Method not allowed'}, 405
    elif request.method == 'POST':
        try:
            kwargs = request.json
            kch = kwargs['kch']
            del kwargs['kch']
        except Exception:
            return {"success": False, "reason": "malformed post data"}, 400
        if (message := nfxqcol_valid(**kwargs)):
            return message
        if not (funcs.safe_trans_int(kch)):
            return {"success": False, "reason": "bad kch"}, 400

    else:
        return {"success": False, "reason": "unsupported http method"}, 503
    nodes, links = dataobj.zhuangke(kch, **kwargs)
    return {"success": True, "data": {'nodes': nodes, 'links': links}}, 200


@app.route("/")
def root_redir():
    return redirect("/main.html")


@app.route("/<path:subpath>")
def static_files(subpath: str):
    @lru_cache
    def getfile(subpath):
        f = open("visualization/" + subpath, mode='rb')
        data = f.read()
        f.close()
        return data
    resp = make_response(getfile(subpath), 200)
    try:
        suffix = subpath.split('/')[-1].split('.')[-1]
        if suffix == 'css':
            mime = "text/css"
        elif suffix in ('html', 'htm'):
            mime = "text/html"
        elif suffix == 'js':
            mime = "application/javascript"
        elif suffix == "ico":
            mime = "image/x-icon"
        else:
            mime = "application/binary"
    except ValueError:
        mime = "text/html"
    resp.headers['Content-Type'] = f"{mime}; charset=utf-8"
    return resp


@app.errorhandler(404)
def not_found(error):
    return "<p>The resource you requested is not found on the server</p>", 404


@app.errorhandler(FileNotFoundError)
def not_found_2(error):
    return "<p>The resource you requested is not found on the server</p>", 404
