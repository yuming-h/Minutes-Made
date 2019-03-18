#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM-KoolAid - main.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import psycopg2
from koolaid import integrations
from flask import Flask, render_template, current_app, session, url_for

#### Flask application setup and configuration
app = Flask(__name__)

#### Global variables
postgresdb = psycopg2.connect(dbname="test", user="postgres", password="secret", host="127.0.0.1", port="5432")

@app.route('/integrations/availible/<meeting_id>', methods=['GET'])
def integrations_availible(meeting_id):
    """Returns a JSON list of availible integrations given a meeting id."""
    return integrations.availible(postgresdb, meeting_id)

@app.route('/integrations/authkeys/<service>/<meeting_id>', methods=['GET'])
def integrations_auth(service, meeting_id):
    """Returns a JSON object with the auth tokens for a given integration."""
    return integrations.auth(postgresdb, service, meeting_id)
