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

        self.missing_lines = set()
        self.missing_idx = 0
        self.latest_idx = 0

    def read_new_lines(self):
        transcript_array_buffer = self.redis.lrange(self.meeting_id, 0, -1)
        transcript_array = [json.loads(x.decode("utf-8")) for x in transcript_array_buffer]
        return(transcript_array)
