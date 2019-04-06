#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM-Sunnyd - sunnyd-main.py
# Minutes Made, Copyright 2019
# Maintainer: Harry Yao

import config_mm as conf

from quart import Quart, abort, Blueprint, current_app, jsonify, request
from flask_pymongo import PyMongo

app = Quart(__name__)

@app.before_first_request
async def create_db():
    """Connect to the postgres database."""
    app.config['MONGO_URI'] = conf.MONGOCONNECTIONURI
    app.mongo = PyMongo(app)

@app.route('/transcripts/add', methods=['POST'])
async def transcripts_add():
    """Adds a transcript to the MongoDB database"""
    data = await request.get_json()
    if check_transcript_request(data):
        data = append_missing_optionals(data)
        app.mongo.db.transcripts.insert_one(data)
        return jsonify({'success': True, 'message': 'Transcript successfully added'}), 200
    return jsonify({'success': False, 'message': 'Bad request parameters'}), 400

def check_transcript_request(data):
    """Validates transcript request"""
    mandatory_keys = ['meeting_id', 'line_number', 'timestamp', 'line_text']
    valid_response = True
    for key in mandatory_keys:
        if data.get(key, None) is None:
            valid_response = False
    return valid_response

def append_missing_optionals(data):
    """Appends missing optional keys to request"""
    optional_keys = ['speaker_id', 'speaker_name']
    optional_arr_keys = ['action_items']
    for key in optional_keys:
        if data.get(key, None) is None:
            data[key] = ''
    for key in optional_arr_keys:
        if data.get(key, None) is None:
            data[key] = []

    return data

if __name__ == "__main__":
    app.run()
