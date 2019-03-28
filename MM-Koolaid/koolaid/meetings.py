#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM-KoolAid - koolaid/meetings.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

from quart import abort, Blueprint, current_app, jsonify, request

blueprint = Blueprint('meetings', __name__)


@blueprint.route('/meetings/create', methods=['POST'])
async def meetings_create():
    """Creates a meeting in the postgres database."""
    data = await request.get_json()
    meeting_data = (
        data['scheduled_meeting_start'],
        data['scheduled_meeting_end'],
    )
    user_in_org_data = (
        data['host_id'],
        data['org_id'],
    )

    try:
        async with current_app.pool.acquire() as connection:
            meeting_id = await connection.fetchval(
                """INSERT INTO meeting(scheduledstarttime, scheduledendtime, active)
                   VALUES ($1, $2, $3)
                   RETURNING meetingid""",
                   *meeting_data,
                   False  # Meeting is not active by default
                )
            await connection.execute(
                """INSERT INTO user_in_org_in_meeting(userid, orgid, meetingid)
                   VALUES ($1, $2, $3)
                   RETURNING meetingid""",
                   *user_in_org_data, meeting_id
                )
        return jsonify({"meetingId": meeting_id})
    except Exception as e:
        print(e)
        abort(400)


@blueprint.route('/meetings/containerid', methods=['GET', 'POST'])
async def meetings_containerid():
    """Adds or gets the container id to/from the database."""
    data = await request.get_json()

    try:
        # POST: Add the container_id into the record
        if request.method == 'POST':
            meeting_id = data['meetingId']
            container_id = data['containerId']

            async with current_app.pool.acquire() as connection:
                await connection.execute(
                    """UPDATE meeting
                        SET containerid = $1
                        WHERE meetingid = $2""",
                        container_id,
                        meeting_id
                    )
            return jsonify({"success": True})

        # GET: Retrieve the container_id from the database
        else:
            meeting_id = data['meetingId']

            async with current_app.pool.acquire() as connection:
                container_data = await connection.fetchrow(
                    """SELECT containerid
                        FROM meeting
                        WHERE meetingid = $1""",
                        meeting_id
                    )
            if container_data is not None:
                return jsonify({'containerId': container_data['containerid'],})
            else:
                abort(404)
    except Exception as e:
        print(e)
        abort(400)


@blueprint.route('/meetings/active', methods=['GET', 'PUT'])
async def meetings_active():
    """Gets or updates the 'active' flag for a meeting from the database."""
    data = await request.get_json()

    try:
        # PUT: Update the meeting active flag
        if request.method == 'PUT':
            meeting_id = data['meetingId']
            is_active = data['active']

            async with current_app.pool.acquire() as connection:
                await connection.execute(
                    """UPDATE meeting
                        SET active = $1
                        WHERE meetingid = $2""",
                        is_active,
                        meeting_id
                    )
            return jsonify({"success": True})

        # GET: Update the meeting active flag
        else:
            meeting_id = data['meetingId']

            async with current_app.pool.acquire() as connection:
                meeting_data = await connection.fetchrow(
                    """SELECT active
                        FROM meeting
                        WHERE meetingid = $1""",
                        meeting_id
                    )
            if meeting_data is not None:
                return jsonify({'active': meeting_data['active'],})
            else:
                abort(404)
    except Exception as e:
        print(e)
        abort(400)


@blueprint.route('/meetings/starttime', methods=['GET', 'PUT'])
async def meetings_starttime():
    """Gets or updates the starttime of a meeting from the database."""
    data = await request.get_json()

    try:
        # PUT: Update the meeting starttime
        if request.method == 'PUT':
            meeting_id = data['meetingId']
            start_time = data['starttime']

            async with current_app.pool.acquire() as connection:
                await connection.execute(
                    """UPDATE meeting
                        SET starttime = $1
                        WHERE meetingid = $2""",
                        start_time,
                        meeting_id
                    )
            return jsonify({"success": True})

        # GET: Update the meeting active flag
        else:
            meeting_id = data['meetingId']

            async with current_app.pool.acquire() as connection:
                starttime_data = await connection.fetchrow(
                    """SELECT starttime
                        FROM meeting
                        WHERE meetingid = $1""",
                        meeting_id
                    )
            if starttime_data is not None:
                return jsonify({'starttime': starttime_data['starttime'],})
            else:
                abort(404)
    except Exception as e:
        print(e)
        abort(400)


@blueprint.route('/meetings/endtime', methods=['GET', 'PUT'])
async def meetings_endtime():
    """Gets or updates the endtime of a meeting from the database."""
    data = await request.get_json()

    try:
        # PUT: Update the meeting endtime
        if request.method == 'PUT':
            meeting_id = data['meetingId']
            end_time = data['endtime']

            async with current_app.pool.acquire() as connection:
                await connection.execute(
                    """UPDATE meeting
                        SET endtime = $1
                        WHERE meetingid = $2""",
                        end_time,
                        meeting_id
                    )
            return jsonify({"success": True})

        # GET: Update the meeting active flag
        else:
            meeting_id = data['meetingId']

            async with current_app.pool.acquire() as connection:
                endtime_data = await connection.fetchrow(
                    """SELECT endtime
                        FROM meeting
                        WHERE meetingid = $1""",
                        meeting_id
                    )
            if endtime_data is not None:
                return jsonify({'endtime': starttime_data['endtime'],})
            else:
                abort(404)
    except Exception as e:
        print(e)
        abort(400)
