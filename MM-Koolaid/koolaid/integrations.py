#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM-KoolAid - koolaid/integrations.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

from quart import abort, Blueprint, current_app, jsonify, request

blueprint = Blueprint('integrations', __name__)

@blueprint.route('/integrations/available/<int:meeting_id>', methods=['GET'])
async def integrations_availible(meeting_id):
    """Returns a JSON list of availible integrations given a meeting id."""
    availible = ['slack', 'jira']
    return jsonify(availible)

@blueprint.route('/integrations/authkeys/<service>/<int:meeting_id>', methods=['GET'])
async def integrations_auth(service, meeting_id):
    """Returns a JSON object with the auth tokens for a given integration."""
    auth_keys = {service: {"token": "test_token", "secret": "shhhh"} }
    return jsonify(auth_keys)
