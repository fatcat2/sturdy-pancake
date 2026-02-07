# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.9-slim

# Install Node.js and yarn for frontend build
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

# Build frontend
WORKDIR $APP_HOME/frontend
RUN yarn install --frozen-lockfile && yarn build

# Back to app root
WORKDIR $APP_HOME

# Install production dependencies.
ENV PYTHONUNBUFFERED True

RUN pip install Flask gunicorn
RUN pip install --no-cache-dir -r requirements.txt

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app