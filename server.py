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

@app.route("/api/test")
def api_test():
    return "success"

@app.route("/api/<sems>")
def api_sems(sems: str):
    if sems in database.keys():
        return {'success': True, 'sems': sems}, 200
    else:
        return {'success': False, 'sems': '0-0-0'}, 404

@app.errorhandler(404)
def not_found(error):
    return "<p>The resource you requested is not found on the server</p>", 404

