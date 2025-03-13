# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set the PORT environment variable
ENV PORT=80

# Expose port 80 instead of 3000
EXPOSE 80

# Command to run the application
CMD ["npm", "start"]
