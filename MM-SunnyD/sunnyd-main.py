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
    """Creates an meeting object in MongoDB"""
    data = await request.get_json()
    meeting_id = data['meeting_id']

    result = app.mongo.db.transcripts.insert_one({'meeting_id': meeting_id, 'lines': []})
    return jsonify({'success': True, 'message': 'Transcript successfully added'}), 200

@app.route('/transcripts/add-tags', methods=['POST'])
async def transcripts_add_tags():
    """Writes tags to a meeting transcript in the MongoDB database"""
    data = await request.get_json()
    meeting_id = data['meeting_id']
    meeting_tags = data['data']['tags']

    try:
        # Perform verification on the lines and appends to item in MongoDB
        result = app.mongo.db.transcripts.update_one({'meeting_id': meeting_id}, {'$set': {'tags': meeting_tags}})

        # Ensure a complete write
        if result.matched_count == 0:
            raise Exception("Could not find meeting object with meeting_id to update")
        if result.modified_count == 0:
            raise Exception("Failed to add the tags to the meeting object in the database")
        # Else
        return jsonify({'success': True, 'message': 'Tags successfully added'}), 200

    except Exception as err:
        return jsonify({'success': False, 'message': '{}'.format(err)}), 400

@app.route('/transcripts/add-lines', methods=['POST'])
async def transcripts_add_lines():
    """Appends an array of transcript lines to the MongoDB database"""
    data = await request.get_json()
    meeting_id = data['meeting_id']
    meeting_lines = data['lines']

    try:
        # Perform verification on the lines and appends to item in MongoDB
        write_lines = [_append_missing_optionals(line) for line in meeting_lines if _check_transcript_request(line)]
        result = app.mongo.db.transcripts.update_one({'meeting_id': meeting_id}, {'$push': {'lines': {'$each': write_lines}}})

        # Ensure a complete write
        if result.matched_count == 0:
            raise Exception("Could not find meeting object with meeting_id to update")
        if result.modified_count == 0:
            raise Exception("Failed to update the transcript item with lines from the database")
        # Else
        return jsonify({'success': True, 'message': 'Lines successfully added'}), 200

    except Exception as err:
        return jsonify({'success': False, 'message': '{}'.format(err)}), 400

def _check_transcript_request(data):
    """Validates transcript request"""
    mandatory_keys = ['meeting_id', 'line_number', 'timestamp', 'line_text']
    valid_response = True
    for key in mandatory_keys:
        if data.get(key, None) is None:
            raise Exception("{} is None when it should not be!".format(key))
    return valid_response

def _append_missing_optionals(data):
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
