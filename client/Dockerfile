FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json /app/

# Install dependencies
RUN npm install

# Copy source code
COPY . /app/

EXPOSE 8081

# Default command to run expo web server
CMD ["npm", "run", "web"]
