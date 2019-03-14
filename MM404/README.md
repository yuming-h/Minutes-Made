# MM404
Meeting session process

## Setup
```
sudo docker-compose build
```

## Running
```
sudo docker-compose up
```
Then navigate to http://127.0.0.1 to test

## MML Job JSON Syntax:
Audio processing job:
```
{
  "job_type": "audio",
  "job_data": {
    "meeting_id": "thisisameetingidstring",
    "speaker_hints": null,
    "audio_uri": "http://mm404/static/files/something.wav",
    "filename": "something.wav"
  }
}
```

Transcript line JSON syntax: *(This syntax will be used for the SunnyD DB write also)*
```
{
  "meeting_id": "thisisameetingidstring",
  "line_number": 3,
  "speaker_name": "Eric Mikulin",
  "speaker_id": "speakeruuidstring",
  "timestamp": "103910293",
  "line_text": "I spoke this line and I meant it"
  "action_item": <action item object>
}
```

Meeting Post processing job:
```
{
  "job_type": "postmeeting",
  "job_data": {
    "meeting_id": "thisisameetingidstring",
    "transcript": <transcript JSON object>
  }
}
```

Post Processing return syntax: *(This syntax will be used for the SunnyD DB write also)*
```
{
  "meeting_id": "thisisameetingidstring",
  "timestamp": "120203019",
  "tags": [
      "hello",
      "tech",
      "code",
      "algorithms"
    ]
}
```
