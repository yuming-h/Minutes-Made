# Use the Python base image
FROM python:3.6

# Use our docker folder structure
RUN mkdir -p /usr/mm/mm-koolaid
WORKDIR /usr/mm/mm-koolaid

# Install pip runtime dependencies
RUN pip install hypercorn hypercorn[uvloop] uvloop quart asyncpg

# Expose working port
EXPOSE 5050

# Use this as the start command
CMD ["hypercorn", "--config", "python:hypercorn.py", "main_mmkoolaid:create_app()"]
