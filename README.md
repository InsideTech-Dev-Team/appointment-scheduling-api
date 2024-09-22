# Appointment Scheduling API

This API allows you to manage appointments, schedules, and bookings.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone git@github.com:InsideTech-Dev-Team/appointment-scheduling-api.git
   ```

2. **Install dependencies:**

   ```bash
   cd appointment-scheduling-api
   bun install
   ```

3. **Create a `.env` file:**

   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**

   ```bash
   bun run dev
   ```

5. **Access the API:**
   The API will be running at `http://localhost:3000`.

6. **View Swagger documentation:**
   The Swagger documentation is available at `http://localhost:3000/swagger/`.

## Docker Compose

To run the API using Docker Compose, follow these steps:

1. **Build the Docker image:**

   ```bash
   docker-compose build
   ```

2. **Start the containers:**

   ```bash
   docker-compose up -d
   ```

3. **Access the API:**
   The API will be running at `http://localhost:3000`.

4. **View Swagger documentation:**
   The Swagger documentation is available at `http://localhost:3000/docs`.
