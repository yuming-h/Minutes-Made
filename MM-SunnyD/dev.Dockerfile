# Use the Python base image
FROM python:3.6

# Use our docker folder structure
RUN mkdir -p /usr/mm/mm-sunnyd
WORKDIR /usr/mm/mm-sunnyd

# Install pip runtime dependencies
RUN pip install hypercorn hypercorn[uvloop] uvloop quart flask-pymongo

# Expose working port
EXPOSE 5055

# Use this as the start command
CMD ["hypercorn", "--config", "python:hypercorn.py", "sunnyd-main:app"]
