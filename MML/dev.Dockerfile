# USe the base python image
FROM python:3.6

# Use our docker folder structure
RUN mkdir -p /usr/mm/mml
WORKDIR /usr/mm/mml

# Install the runtime dependencies
RUN pip install redis requests speechrecognition

# Expose the working port
EXPOSE 5000

# Use this as the start command
CMD ["python", "main_mml.py"]
