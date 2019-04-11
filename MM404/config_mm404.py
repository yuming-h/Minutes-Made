import os

# Get MinutesMade Environment Key
ENV = os.environ.get('MM_ENV')
if not ENV:
    ENV = 'local'

#### Local Environment
if ENV == 'local':
    SUNNYD_DOMAIN = "http://mmsunnyd:5055"
    REDIS_HOST = "redis-processing"

#### Dev Environment
elif ENV == 'dev':
    SUNNYD_DOMAIN = "http://mmsunnyd:5055"
    REDIS_HOST = "redis-processing"

#### Production Environment
elif ENV == 'production':
    SUNNYD_DOMAIN = "http://mmsunnyd:5055"
    REDIS_HOST = "redis-processing"
