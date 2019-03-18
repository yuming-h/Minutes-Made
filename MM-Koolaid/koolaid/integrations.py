#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM-KoolAid - koolaid/integrations.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

def availible(db, meeting_id):
    """Returns a JSON list of availible integrations given a meeting id."""
    return meeting_id

def auth(db, service, meeting_id):
    """Returns a JSON object with the auth tokens for a given integration."""
    return "{}{}".format(service, meeting_id)
