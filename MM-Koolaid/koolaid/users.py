#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM-KoolAid - koolaid/users.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

from quart import abort, Blueprint, current_app, jsonify, request

blueprint = Blueprint('users', __name__)


@blueprint.route('/users/create', methods=['POST'])
async def users_create():
    """Creates a user in the postgres database."""
    data = await request.get_json()
    user_data = data['user']

    try:
        async with current_app.pool.acquire() as connection:
            uid = await connection.fetchval(
                """INSERT INTO users(email, password, country, language, firstname, lastname, registerdate, lastlogin)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                   RETURNING userid""",
                   *user_data
                )
        return jsonify({"userId": uid})
    except:
        abort(400)


@blueprint.route('/users/password', methods=['POST'])
async def users_password():
    """Gets the hashed password given user email."""
    data = await request.get_json()
    user_email = data['email']

    async with current_app.pool.acquire() as connection:
        passwd_data = await connection.fetchrow(
            """SELECT "password", email, userid
                FROM users
                WHERE email = $1""",
                user_email
            )
    if passwd_data is not None:
        return jsonify({'password': passwd_data['password'],
                        'email': passwd_data['email'],
                        'userId': passwd_data['userid']})
    else:
        abort(404)


@blueprint.route('/users/login-timestamp', methods=['PUT'])
async def users_login_timestamp():
    """Updates the login timestamp to a new time."""
    data = await request.get_json()
    user_email = data['email']
    new_timestamp = data['timestamp']

    async with current_app.pool.acquire() as connection:
        uid = await connection.execute(
            """UPDATE users
               SET lastlogin = $1
               WHERE email = $2""",
               new_timestamp,
               user_email
            )
    return jsonify({"success": True})

@blueprint.route('/users/<int:user_id>/meetings', methods=['GET'])
async def users_transcripts(user_id):
    """Gets the meeting metadata for a user."""

    async with current_app.pool.acquire() as connection:
        meeting_records = await connection.fetch(
            """SELECT meetingId
               FROM  user_in_org_in_meeting
               WHERE userid = $1""",
               user_id,
            )

        if not meeting_records:
            abort(404)

        meeting_ids = [record['meetingid'] for record in meeting_records]

        meeting_meta_records = await connection.fetch(
            """SELECT meetingid, starttime, endtime, active, scheduledstarttime, scheduledendtime
               FROM meeting
               WHERE meetingid = ANY($1::int[])""",
               meeting_ids,
            )

        return jsonify([dict(record) for record in meeting_meta_records])
