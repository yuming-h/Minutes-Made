#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM404 - transcache.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

class TransCacheReader():
    """Acts a per session reader of the cache."""

    def __init__(self):
        self.missing_lines = set()
        self.pointer = 0

    def read_new_lines(self, transcache):
        pass

    def read_full_transcript(self, transcache):
        pass

class TransCache():
    """Acts as a local cache for the transcript."""

    def __init__(self):
        self.transcript = {}  # Line Number : Line as Dict

    def read_line_range(self, line_number_range):
        pass

    def read_line(self, line_number):
        pass

    def add_line(self, line_dict):
        pass
