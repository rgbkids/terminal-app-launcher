# Use the latest Node.js as the base image
FROM node:18

# Install necessary tools
RUN apt-get update && apt-get install -y git

# Create a working directory
WORKDIR /app

# Clone the Git repository
RUN git clone -b feat/api https://github.com/rgbkids/terminal-app.git .

# Install packages
RUN npm install --legacy-peer-deps

# Accept a port as a build argument (default is 8080)
ARG PORT=8080
ENV PORT=${PORT}

# Replace the default port with the specified PORT value in the script
RUN sed -i "s/8080/${PORT}/g" src/server.ts
RUN sed -i 's/HOME_DIR = ""/HOME_DIR = "\/app\/terminal-app\/vercel\/examples\/nextjs"/g' src/server.ts

# Build the application
RUN npm run build

# Create a Next.js application
WORKDIR /app/terminal-app/vercel
# RUN npx create-next-app@latest my-next-app -y
RUN git clone -b main https://github.com/vercel/vercel.git .
# RUN npm install
WORKDIR /app

# Start the server when the container is launched
CMD ["npm", "start"]

# Expose the specified port to allow external access
EXPOSE ${PORT}
