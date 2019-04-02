#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM-KoolAid - main.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import asyncpg
import config_mm as conf
from koolaid import integrations, meetings, users
from quart import Quart

def create_app():
    """Application factory for Koolaid app."""
    app = Quart(__name__)

    @app.before_first_request
    async def create_db():
        """Connect to the postgres database."""
        app.pool = await asyncpg.create_pool(user=conf.PGDB['user'],
                                             password=conf.PGDB['password'],
                                             host=conf.PGDB['host'],
                                             port=conf.PGDB['port'],
                                             database=conf.PGDB['database'],
                                             max_size=20)

    # Register the sub apps, each app represents a table / data group
    app.register_blueprint(integrations.blueprint)
    app.register_blueprint(meetings.blueprint)
    app.register_blueprint(users.blueprint)

    return app

if __name__ == '__main__':
    create_app().run()
