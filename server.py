from flask import Flask, request, redirect, url_for
from typing import Dict, Any
from functools import lru_cache
from data_cleaning import getdata
import pandas as pd

app = Flask(__name__)

database = getdata()

@app.route("/api/teapot")
def api_teapot():
    return "<p>I'm a teapot!</p>", 418

@app.route("/api/test")
def api_test():
    return {"success": True}

@app.route("/api/overview/<sems>")
def api_sems(sems: str):
    if sems in database.keys():
        return {'success': True, 'sems': sems}, 200
    else:
        return {'success': False, 'reason': 'invalid sems'}, 404
    
@app.route("/api/conflict")
def api_conflict(method=['GET', 'POST']):
    if method == 'GET':
        return {'success': False, 'reason': 'Method not allowed'}, 405
    elif method == 'POST':
        pass
        return {}, 200
    else:
        return {'success': False, 'reason': 'Not implemented'}, 501
    
@app.route("/api/get_semesters")
def api_get_semesters():
    return {"success": True, "data": sorted(getdata()['nfxq'].unique().tolist())}

@app.route("/api/get_college")
def api_get_college():
    return {"success": True, "data": {'00001': '数学科学学院', '00003': '力学与工程科学系', '00004': '物理学院', '00010': '化学与分子工程学院', '00011': '生命科学学院', '00012': '地球与空间科学学院', '00016': '心理与认知科学学院', '00017': '软件与微电子学院', '00018': '新闻与传播学院', '00020': '中国语言文学系', '00021': '历史学系', '00022': '考古文博学院', '00023': '哲学系', '00024': '国际关系学院', '00025': '经济学院', '00028': '光华管理学院', '00029': '法学院', '00030': '信息管理系', '00031': '社会学系', '00032': '政府管理学院', '00038': '英语语言文学系', '00039': '外国语学院', '00040': '马克思主义学院', '00041': '体育教研部', '00043': '艺术学院', '00044': '对外汉语教育学院', '00046': '元培学院', '00048': '信息科学技术学院', '00055': '王选计算机研究所', '00062': '国家发展研究院', '00067': '教育学院', '00068': '人口研究所', '00084': '前沿交叉学科研究院', '00086': '工学院', '00126': '城市与环境学院', '00127': '环境科学与工程学院', '00182': '分子医学研究所', '00187': '中国社会科学调查中心', '00188': '中国教育财政科学研究所', '00192': '歌剧研究院', '00195': '建筑与景观设计学院', '00199': '产业技术研究院', '00201': '汇丰商学院', '00204': '继续教育学院', '00206': '新媒体研究院', '00207': '海洋研究院', '00211': '现代农学院', '00217': '南南合作与发展学院', '00221': '习近平新时代中国特色社会主义思想研究院', '00225': '人工智能研究院', '00232': '材料科学与工程学院', '00607': '学生工作部人民武装部', '00612': '教务部', '00622': '科技开发部', '00651': '中国共产主义青年团北京大学委员会', '00671': '创新创业学院', '10180': '医学部教学办'}}

@app.route("/")
def root_redir():
    return redirect("/main.html")
    
@app.route("/<path:subpath>")
def static_files(subpath):
    @lru_cache
    def getfile(subpath):
        f = open("visualization/" + subpath, mode='rb')
        data = f.read()
        f.close()
        return data, 200
    return getfile(subpath)

@app.errorhandler(404)
def not_found(error):
    return "<p>The resource you requested is not found on the server</p>", 404

@app.errorhandler(FileNotFoundError)
def not_found_2(error):
    return "<p>The resource you requested is not found on the server</p>", 404
