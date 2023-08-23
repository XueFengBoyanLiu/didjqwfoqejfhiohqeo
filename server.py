from funcs import data
from flask import Flask, request, redirect, url_for
from typing import Dict, Any
from functools import lru_cache
import json
import gzip
import os

app = Flask(__name__)

database: Dict[str, Any] = json.load(gzip.open('database.json.gz'))

@app.route("/api/teapot")
def api_teapot():
    return "<p>I'm a teapot!</p>", 418

@app.route("/api/test")
def api_test():
    return "success"

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
