from funcs import data
from flask import Flask, request
from typing import Dict, Any
import json
import gzip

app = Flask(__name__)

database: Dict[str, Any] = json.load(gzip.open('database.json.gz'))

@app.route("/")
def hello():
    return "<p>Server has successfully set up</p>"

@app.route("/api/teapot")
def api_teapot():
    return "<p>I'm a teapot!</p>", 418

@app.route("/api/test")
def api_test():
    return "success"

@app.route("/api/<sems>")
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

@app.errorhandler(404)
def not_found(error):
    return "<p>The resource you requested is not found on the server</p>", 404

