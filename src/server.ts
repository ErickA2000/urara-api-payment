import dotenv from "dotenv";
dotenv.config();

import { createCounter } from "@Libs/initialSetup";
createCounter();

import App from "app";


const server = new App();

server.start();