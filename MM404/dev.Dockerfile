# Use the base python 3 image
FROM python:3.6

# Use our docker folder structure
RUN mkdir -p /usr/mm/mm404
WORKDIR /usr/mm/mm404

# Install runtime dependencies
RUN apt-get update -y && apt-get install -y gunicorn
RUN pip install gunicorn[eventlet] flask python-socketio flask_socketio redis numpy scipy requests

# Expose the working port
EXPOSE 5000

# Use this as the start command
CMD ["gunicorn", "-k", "eventlet", "-w", "1", "main_mm404:app", "--bind=0.0.0.0:5000", "--no-sendfile"]
