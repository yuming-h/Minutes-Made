# MML - main.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import time
import redis
import requests
import json
import os

import speech_recognition as sr

REDIS_JOB_QUEUE_KEY = 'job-queue'
MEDIA_DIR = "media/"
FETCH_INTERVAL = 0.1

def translate_to_text(audio_fn):
    """Test function needs to be replaced"""
    r = sr.Recognizer()

    speech_audio_file = sr.AudioFile(audio_fn)

    with speech_audio_file as source:
        r.adjust_for_ambient_noise(source, duration=0.5)
        audio = r.record(source)

    try:
        text = r.recognize_google(audio)
    except:
        print("Google didn't work")
        text = None

    return text

def process_from_redis(redisdb):
    """Pops an audio ML job off of the queue and processes it"""
    # Pop the data from the queue
    audio_processing_job = redisdb.rpop(REDIS_JOB_QUEUE_KEY)
    if not audio_processing_job:
        time.sleep(FETCH_INTERVAL)
        return

    # Extract key information from the redis item
    audio_processing_job = json.loads(audio_processing_job)
    local_fn = MEDIA_DIR + audio_processing_job['job_data']['filename']
    mm404_url = "http://mm404:5000" + audio_processing_job['job_data']['audio_uri']

    # Download the .wav file from the server
    with requests.get(mm404_url, stream=True) as req:
        with open(local_fn, 'wb') as fil:
            for chunk in req.iter_content(chunk_size=8192):
                if chunk:
                    fil.write(chunk)

    # Do the speech recognition
    epoch_seconds = round(time.time())
    transcript_line = translate_to_text(local_fn)
    redis_payload = {
        "meeting_id": audio_processing_job['job_data']['meeting_id'],
        "line_number": 3,
        "speaker_name": "Eric Mikulin",
        "speaker_id": "speakeruuidstring",
        "timestamp": epoch_seconds,
        "line_text": transcript_line,
        "action_item": None
    }

    # Push back to redis
    if transcript_line:
        redisdb.rpush(audio_processing_job['job_data']['meeting_id'], json.dumps(redis_payload))

def main():
    redisdb = redis.StrictRedis(host='redis-processing', port=6379, db=0)
    os.makedirs(MEDIA_DIR, exist_ok=True)

    while True:
        process_from_redis(redisdb)

if __name__ == "__main__":
    main()
