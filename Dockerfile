# Use the latest Node.js as the base image
FROM node:18

# Install necessary tools
RUN apt-get update && apt-get install -y git

# Create a working directory
WORKDIR /app

# Clone the Git repository
RUN git clone -b feat/ssl https://github.com/rgbkids/terminal-app.git .

# Create the SSL directory and copy the SSL files
RUN mkdir -p /app/ssl
COPY ssl/private.key /app/ssl/private.key
COPY ssl/term-app.crt /app/ssl/term-app.crt
COPY ssl/term-app.ca-bundle /app/ssl/term-app.ca-bundle

# Install packages
RUN npm install --legacy-peer-deps

# Accept a port as a build argument (default is 8080)
ARG PORT=443
ENV PORT=${PORT}

# Replace the default port with the specified PORT value in the script
RUN sed -i "s/443/${PORT}/g" src/server.ts
RUN sed -i 's/HOME_DIR = ""/HOME_DIR = "\/app\/terminal-app\/vercel\/examples\/nextjs"/g' src/server.ts

# Build the application
RUN npm run build

# Create a Next.js application
WORKDIR /app/terminal-app/vercel
RUN git clone -b main https://github.com/vercel/vercel.git .
WORKDIR /app
COPY ssl/nextjs/package.json /app/terminal-app/vercel/examples/nextjs/package.json
COPY ssl/nextjs/server.js /app/terminal-app/vercel/examples/nextjs/server.js

# Start the server when the container is launched
CMD ["npm", "start"]

# Expose the specified port to allow external access
EXPOSE ${PORT}