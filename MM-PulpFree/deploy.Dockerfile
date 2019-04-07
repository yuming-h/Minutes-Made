# Use the dev image as a base
FROM docker.minutesmade.com/mmpulpfree-dev

# Copy in the source files
COPY . .

# Set the new working directory
WORKDIR /usr/mm/mm-pulpfree/app
