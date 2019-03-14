#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM404 - main.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import time
import uuid
import wave
import json
import redis
import eventlet
import numpy as np
from collections import deque
from flask import Flask, render_template, current_app, session, url_for
from flask_socketio import SocketIO, emit
from ltsd import LTSD_Detector
from transcache import TransCacheReader

#### Flask application setup and configuration
app = Flask(__name__)
app.config['FILEDIR'] = 'static/_files/'
socketio = SocketIO(app)

#### Audio detection constants
SILENCE_LIMIT = 1.5  # Number of seconds of silence before audio phrase has ended
PREV_AUDIO = 1  # Amount of previous audio (in seconds) to prepend to the audio phrase
CHUNK = 2048
LTSD_CHUNK = int( CHUNK/2 )
LTSD_ORDER = 5

#### Other Constants
FETCH_INTERVAL = 0.1
REDIS_JOB_QUEUE_KEY = 'job-queue'
REDIS_WRITE_QUEUE_KEY = 'write-queue'

#### Global variables
redis_processing = None
redis_write = None
meeting_id = None

@app.route('/')
def index():
    """Return the client application. This frontend is used purely for testing purposes."""
    return render_template('index.html')

def start_meeting():
    """Preps MM404 to begin a meeting.
    - Creates global redis queue links
    - Creates global transcript cache
    - Spawns transcript retriever thread
    """
    # Conect to the processing redis database
    global redis_processing
    redis_processing = redis.StrictRedis(host='redis-processing', port=6379, db=0)

    # Connect to the db write redis database
    global redis_write
    redis_write = redis.StrictRedis(host='redis-write', port=6378, db=0)

    # Get the meeting ID
    global meeting_id
    meeting_id = uuid.uuid4().hex  # TODO: This is temporary until PulpFree spawing is configured, this currently breaks multiple gunicorn workers :(

    # Spawn sync thread
    eventlet.monkey_patch()  # Patch modules to be non-blocking (Looking at you REDIS!)
    eventlet.spawn(transcript_sync_worker)
    print("Ready to start meeting!")

@socketio.on('connect')
def on_connect():
    """Handles when a user connects to the websocket"""
    session['transcript_reader'] = TransCacheReader(meeting_id, redis_processing)

@socketio.on('disconnect')
def on_disconnect():
    """Handles when a user disconnects from the websocket"""
    del session['transcript_reader']

@socketio.on('start-recording')
def start_recording(options):
    """Prepares MM404 to begin processing audio recording.
    - Creates VAD system
    """
    print("Recording starts!")

    # Set up the session variables for the audio detection
    session['options'] = options
    session['delta'] = options.get('fps', 44100) / CHUNK
    session['prev_audio'] = deque(maxlen=int(PREV_AUDIO * session['delta']))
    session['detect_win'] = deque(maxlen=int(SILENCE_LIMIT * session['delta']))
    session['captured_audio'] = []
    session['started'] = False
    session['ltsd'] = LTSD_Detector(LTSD_CHUNK, LTSD_ORDER)

def chunks(l, n):
    """(Generator) Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
        yield l[i:i + n]

@socketio.on('write-audio')
def detect_audio(data):
    """Voice activity detection of audio chunks from the client."""
    for bchunk in chunks(data, CHUNK):
        session['detect_win'].append(np.float32(np.fromstring(bchunk, np.int16)))

        # Buffer is not long enough yet
        if len(session['detect_win']) < session['detect_win'].maxlen:
            session['ltsd'].compute_noise_spectrum(list(session['detect_win']))  # Assume that the start of the recording is the noise
            print("Filling buffer")

        # Otherwise if speech is detected
        elif session['ltsd'].compute_window(list(session['detect_win'])):
            if not session['started']:
                session['started'] = True
                print("Speech starts!")
            session['captured_audio'].append(bchunk)

        # Otherwise no speech, but previsouly was detecting speech
        elif session['started'] is True:
            print("Speech ends!")
            # The limit was reached, finish capture and deliver.
            write_speech_file(list(session['prev_audio']) + session['captured_audio'])

            # Reset audio detection session variables
            session['started'] = False
            session['prev_audio'].clear()
            session['captured_audio'] = []

        # No speech detected and no previous speech detected
        else:
            session['ltsd'].update_noise_spectrum(list(session['detect_win']))  # Update the noise spectrum
            session['prev_audio'].append(bchunk)

def write_speech_file(audio):
    """Writes audio data to a wavefile, enqueues the audio to be processed in redis"""
    filename = meeting_id + "-" + uuid.uuid4().hex + ".wav"

    wf = wave.open(current_app.config['FILEDIR'] + filename, 'wb')
    wf.setnchannels(session['options'].get('numChannels', 1))
    wf.setsampwidth(session['options'].get('bps', 16) // 8)
    wf.setframerate(session['options'].get('fps', 44100))

    byte_stream_audio = b''.join(audio)
    wf.writeframes(byte_stream_audio)
    wf.close()

    # Enqueues the speech chunk for processing with MML
    audio_chunk_url = url_for('static', filename='_files/' + filename)
    redis_payload = { "job_type": "audio",
        "job_data": {
            "meeting_id": meeting_id,
            "speaker_hints": None,
            "audio_uri": audio_chunk_url,
            "filename": filename
        }
    }

    # Queue the audio chunk to be processed by REDIS
    redis_processing.lpush(REDIS_JOB_QUEUE_KEY, json.dumps(redis_payload))

    return filename

def transcript_sync_worker():
    """Fetches the transcript from redis and performs routing.
    - Routes the transcript lines to db write
    - If action item, POSTs to MMIO
    """
    worker_transcript_reader = TransCacheReader(meeting_id, redis_processing)

    while True:
        # Get the transcript from redis
        new_transcript_lines = worker_transcript_reader.read_new_lines()

        # Process the new lines
        for transcript_line in new_transcript_lines:
            # Enqueue line to go write to the database
            redis_write.lpush(REDIS_WRITE_QUEUE_KEY, json.dumps(transcript_line))

            # Process action item
            if transcript_line['action_item']:
                print("ACTION ITEM!")

        time.sleep(FETCH_INTERVAL)

@socketio.on('fetch-transcript')
def fetch_transcript():
    """Fetches the updated lines from transcript cache and routes to frontend."""

    # Get the transcript from redis
    new_transcript_lines = session['transcript_reader'].read_new_lines()
    emit('transcript-updated', json.dumps(new_transcript_lines))

@socketio.on('end-recording')
def end_recording():
    """Cleans up MM404 recording.
    - Delete session variables
    """
    print("Recording ends!")

    # Tear down the session variables
    del session['options']
    del session['delta']
    del session['prev_audio']
    del session['detect_win']
    del session['captured_audio']
    del session['started']
    del session['ltsd']

#### Meeting init
start_meeting()  # Run this function at app startup
