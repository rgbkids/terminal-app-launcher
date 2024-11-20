# NestJS Docker Launcher

This project provides an API using NestJS to launch Docker containers with specified port configurations. The guide below explains how to set up and use this project.

## Installation and Setup

1. **Install dependencies**
   ```sh
   pnpm install
   ```

2. **Build the project**
   Compile TypeScript to generate the `dist` folder:
   ```sh
   pnpm run build
   ```

3. **Run the development server**
   Run the server in watch mode for development:
   ```sh
   pnpm run dev
   ```

4. **Run the production server**
   Start the server for production:
   ```sh
   pnpm run start

   # # pm2
   # pnpm run start:pm2
   # pnpm run stop:pm2
   ```

## Running the Docker API

To run a Docker container remotely, send a `GET` request to the `/run-docker` endpoint, specifying the ports to use as query parameters:

```sh
curl "http://localhost:8080/run-docker?PORT_API=8081&PORT_WEB=3001"
```

### NOTE

- **Remote operation via GET request**: The `/run-docker` endpoint allows you to specify port numbers remotely when launching a Docker container.
- **Port configuration**: Pass `PORT_API` and `PORT_WEB` as query parameters to dynamically configure the ports exposed by the Docker container.
- **API endpoint**: `/run-docker` triggers the Docker container launch, using the specified port numbers.

This API helps to manage Docker containers flexibly and programmatically, making it easy to adjust configurations based on requirements.

## Dockerfile for Launching

### Case 1: Launch the application on port 8081

```bash
docker build -t term-app --build-arg PORT=8081 .
# docker build --no-cache -t term-app --build-arg PORT=8081 .

# Term + Web
docker run -d -p 8081:8081 -p 3001:3000 -it term-app
# Term Only
# docker run -d -p 8081:8081 term-app
```

**NOTE**: Stop the container
```sh
docker ps
docker stop <name>
```

**NOTE**: Remove containers, images, volumes, etc.
```sh
docker container prune
docker image prune
docker volume prune
docker system prune -a
```

**NOTE**: Access the container
```sh
docker exec -it -u root <name> bash
```

### Case 2: Launch the application on port 8082

```bash
docker build -t term-app --build-arg PORT=8082 .
docker run -d -p 8082:8082 -p 3002:3000 -it term-app
```
