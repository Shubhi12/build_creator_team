FROM mcr.microsoft.com/devcontainers/python:3.11-bookworm

# Install Node.js 22.x, postgresql-client, and build tools
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get update && apt-get install -y --no-install-recommends \
       nodejs \
       postgresql-client \
       gcc \
       libpq-dev \
    && rm -rf /var/lib/apt/lists/*
