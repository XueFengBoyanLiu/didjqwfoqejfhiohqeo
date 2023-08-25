from flask import Flask, request, redirect, url_for, make_response
from typing import Dict, Any, Tuple
from functools import lru_cache
from data_cleaning import getdata
import pandas as pd
import funcs

app = Flask(__name__)

database: pd.DataFrame = pd.read_pickle('df.pkl')
dataobj = funcs.data(database)


def sems_valid(sems: str) -> Tuple[int, int] | None:
    sems = sems.split('-')
    if not ((nf := funcs.safe_trans_int(sems[0]) in funcs.NF_TUPLE) and (xq := funcs.safe_trans_int(sems[1]) in funcs.XQ_DICT[nf])):
        return None
    return nf, xq


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


@app.route("/api/conflict", methods=['GET', 'POST'])
def api_conflict():
    if request.method == 'GET':
        return {'success': False, 'reason': 'Method not allowed'}, 405
    elif request.method == 'POST':
        pass
        return {}, 200
    else:
        return {'success': False, 'reason': 'Not implemented'}, 501
    # TODO


@app.route("/api/get_semesters")
def api_get_semesters():
    '''
    data:json
    '''
    return {"success": True, "data": funcs.get_nfxq_UI_text()}


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
    '''

    qsn: int
    xq: int
    college: str
    if request.method == 'GET':
        qsn = 0
        xq = 0
        college = ""
    elif request.method == 'POST':
        try:
            j = request.json
            qsn, xq, college = j['qsn'], j['xq'], j['college']
            del j
        except Exception:
            return {"success": False, "reason": "malformed post data"}, 400
        if not ((type(qsn) == int) and (type(xq) == int) and (type(college) == str)):
            return {"success": False, "reason": "malformed post data"}, 400
        if (qsn and qsn not in funcs.XQ_DICT.keys()) or (xq and xq not in funcs.XQ_DICT[qsn]) or (college and college not in funcs.COLLEGE_DICT.keys()):
            return {"success": False, "reason": "invalid range of post data"}, 400
    else:
        return {"success": False, "reason": "unsupported http method"}, 503

    return {"success": True, "data": dataobj.get_heatmap(qsn, xq, college)}, 200


@app.route('/api/get_trend', methods=['GET', 'POST'])
def api_get_trend():
    '''
    return a json dict object
    '''

    college: str = ""
    if request.method == "GET":
        pass
    elif request.method == "POST":
        try:
            college = request.json['college']
        except Exception:
            return {"success": False, "reason": "malformed post data"}, 400
    else:
        return {"success": False, "reason": "unsupported http method"}, 400

    return {"success": True, "data": dataobj.get_trend(college)}, 200


@app.route('/api/get_typed_courses', methods=['GET', 'POST'])
def api_get_typed_courses():
    '''
    return a json dict object
    '''

    qsn: int
    xq: int
    college: str
    if request.method == 'GET':
        qsn = 0
        xq = 0
        college = ""
    elif request.method == 'POST':
        try:
            j = request.json
            qsn, xq, college, types = j['qsn'], j['xq'], j['college'], j['types']
            del j
        except Exception:
            return {"success": False, "reason": "malformed post data"}, 400
        if not ((type(qsn) == int) and (type(xq) == int) and (type(college) == str) and (type(types)==list)):
            return {"success": False, "reason": "malformed post data"}, 400
        if (qsn and qsn not in funcs.XQ_DICT.keys()) or (xq and xq not in funcs.XQ_DICT[qsn]) or (college and college not in funcs.COLLEGE_DICT.keys()):
            return {"success": False, "reason": "invalid range of post data"}, 400
        if not all([(x in funcs.COURSE_TYPE_DICT.keys()) for x in types]) :
            return {'success': False, 'reason': 'unsupported types'}
    else:
        return {"success": False, "reason": "unsupported http method"}, 503
    return {"success": True, "data": dataobj.get_typed_courses_with_types(qsn, xq, college, types)}, 200


@app.route('/api/get_weektime_distribution', methods=['GET', 'POST'])
def api_get_weektime_distribution():
    '''
    return a json dict object
    '''
    qsn: int
    xq: int
    college: str
    if request.method == 'GET':
        qsn = 0
        xq = 0
        college = ""
    elif request.method == 'POST':
        try:
            j = request.json
            qsn, xq, college = j['qsn'], j['xq'], j['college']
            del j
        except Exception:
            return {"success": False, "reason": "malformed post data"}, 400
        if not ((type(qsn) == int) and (type(xq) == int) and (type(college) == str)):
            return {"success": False, "reason": "malformed post data"}, 400
        if (qsn and qsn not in funcs.XQ_DICT.keys()) or (xq and xq not in funcs.XQ_DICT[qsn]) or (college and college not in funcs.COLLEGE_DICT.keys()):
            return {"success": False, "reason": "invalid range of post data"}, 400
    else:
        return {"success": False, "reason": "unsupported http method"}, 503

    return {"success": True, "data": dataobj.get_weektime_distribution(qsn, xq, college)}, 200


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
