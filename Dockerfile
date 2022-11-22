FROM node:18.9.0-alpine
WORKDIR /nodejsproject
COPY ["package.json", "package-lock.json", "./"]
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]