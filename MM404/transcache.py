#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM404 - transcache.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import json

class TransCacheReader():
    """Acts a per session reader of the cache."""

    def __init__(self, meeting_id, redis):
        self.redis = redis
        self.meeting_id = meeting_id

        self.latest_idx = 0

    def read_new_lines(self):
        """Reads lines from the redis cache that haven't been read before"""
        # Get the "end" of the transcript
        transcript_len = self.redis.llen(self.meeting_id)

        # Get the newest transcript lines from the redis cache
        transcript_bytes_array = self.redis.lrange(self.meeting_id, self.latest_idx, transcript_len-1)
        transcript_array = [json.loads(line.decode("utf-8")) for line in transcript_bytes_array]

        # Update the index with the new length
        self.latest_idx = transcript_len

        return transcript_array

    def read_post_meeting(self):
        """Reads the post-meeting payload from the redis cache"""
        postmeeting_bytes = self.redis.get(self.meeting_id+"-postmeeting")
        return json.loads(postmeeting_bytes.decode("utf-8")) if postmeeting_bytes else None

    def cleanup(self):
        """Deletes the two redis keys from the database"""
        print("Flushing REDIS transcription keys for meeting id", self.meeting_id)
        self.redis.delete(self.meeting_id+"-postmeeting")
        self.redis.delete(self.meeting_id)
