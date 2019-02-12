# MM404 - main.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import os
import uuid
import wave
import math
import audioop
from collections import deque
from flask import Flask, render_template, current_app, session, url_for, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['FILEDIR'] = 'static/_files/'
socketio = SocketIO(app)

@app.route('/')
def index():
    """Return the client application. This frontend is used purely for testing purposes."""
    return render_template('index.html')

@socketio.on('start-recording')
def start_recording(options):
    """Start recording audio from the client."""
    print("Recording starts!")
    id = uuid.uuid4().hex  # server-side filename
    session['base_wavename'] = id

    # Set up the session variables for the audio detection
    session['options'] = options
    session['delta'] = options.get('fps', 44100) / CHUNK
    session['prev_audio'] = deque(maxlen=int(PREV_AUDIO * session['delta']))
    session['slid_win'] = deque(maxlen=int(SILENCE_LIMIT * session['delta']))
    session['captured_audio'] = []
    session['started'] = False
    session['filenames'] = []


SILENCE_LIMIT = 1  # Number of seconds of silence before audio phrase has ended
PREV_AUDIO = 0.75  # Amount of previous audio (in seconds) to prepend to the audio phrase
THRESHOLD = 3000
CHUNK = 1024

def chunks(l, n):
    """(Generator) Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
        yield l[i:i + n]

@socketio.on('write-audio')
def detect_audio(data):
    """Voice activity detection of audio chunks from the client."""
    for bchunk in chunks(data, CHUNK):
        session['slid_win'].append(math.sqrt(abs(audioop.avg(bchunk, 4))))

        # If speech is detected
        if sum([x > THRESHOLD for x in session['slid_win']]) > 0:
            if not session['started']:
                session['started'] = True
                print("Speech starts!")
            session['captured_audio'].append(bchunk)

        # Otherwise no speech, but previsouly was detecting speech
        elif session['started'] is True:
            print("Speech ends!")
            # The limit was reached, finish capture and deliver.
            filename = write_speech(list(session['prev_audio']) + session['captured_audio'])

            # Reset audio detection session variables
            session['started'] = False
            session['slid_win'] = deque(maxlen=int(SILENCE_LIMIT * session['delta']))
            session['prev_audio'] = deque(maxlen=int(0.5 * session['delta']))
            session['captured_audio'] = []

        # No speech detected and no previous speech detected
        else:
            session['prev_audio'].append(bchunk)

def write_speech(audio):
    """Writes audio data to a wavefile, returns the filename."""
    filename = session['base_wavename'] + "-" + uuid.uuid4().hex + ".wav"

    wf = wave.open(current_app.config['FILEDIR'] + filename, 'wb')
    wf.setnchannels(session['options'].get('numChannels', 1))
    wf.setsampwidth(session['options'].get('bps', 16) // 8)
    wf.setframerate(session['options'].get('fps', 44100))

    byte_stream_audio = b''.join(audio)
    wf.writeframes(byte_stream_audio)
    wf.close()

    # Emit link to wavfile via websockets
    emit('add-wavefile', url_for('static', filename='_files/' + filename))
    session['filenames'].append(filename)
    return filename

@socketio.on('end-recording')
def end_recording():
    """Stop recording audio from the client."""
    print("Recording ends!")

    # Tear down the session variables
    del session['options']
    del session['delta']
    del session['base_wavename']
    del session['prev_audio']
    del session['slid_win']
    del session['captured_audio']
    del session['started']
    del session['filenames']

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')