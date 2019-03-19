#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM-KoolAid - main.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import asyncpg
from koolaid import integrations
from quart import Quart

POSTGRES_DSN = 'THIS_IS_THE_POSTGRES_DSN'

def create_app():
    """Application factory for Koolaid app."""
    app = Quart(__name__)

    @app.before_first_request
    async def create_db():
        """Connect to the postgres database."""
        app.pool = await asyncpg.create_pool(POSTGRES_DSN, max_size=20)

    # Register the sub apps, each app represents a table / data group
    app.register_blueprint(integrations.blueprint)

    return app

if __name__ == '__main__':
    create_app().run()
