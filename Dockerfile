# Use a base image suitable for your application
FROM node:14 as frontend

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy the frontend application source code
COPY ./mypp/package.json ./mypp/package-lock.json ./
COPY ./mypp .

# Install frontend dependencies
RUN npm install

# Build the frontend application
RUN npm run build

# Create a separate image for the backend
FROM node:14 as backend

# Set the working directory for the backend
WORKDIR /app/backend

# Copy the backend application source code
COPY ./api/package.json ./api/package-lock.json ./
COPY ./api/ .

# Install backend dependencies
RUN npm install

# Expose the necessary port for the backend
EXPOSE 8000

# Start the backend application
CMD ["npm", "start"]
