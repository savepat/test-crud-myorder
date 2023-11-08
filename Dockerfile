# Use a base image suitable for your application
FROM node:14

# Set the working directory for the application
WORKDIR /app

# Copy both frontend and backend application source code
COPY ./mypp ./frontend
COPY ./api ./backend

# Install application dependencies
RUN npm install --prefix frontend
RUN npm install --prefix backend

# Build the frontend application
RUN npm run build --prefix frontend

# Expose the necessary port for the backend
EXPOSE 8000

# Start the backend application
CMD ["npm", "start", "--prefix", "backend"]
