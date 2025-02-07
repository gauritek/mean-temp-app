# Use Node.js base image for React
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the React code
COPY . .

# Expose the port for React app
EXPOSE 3000

# Run the React app
CMD ["npm", "start"]