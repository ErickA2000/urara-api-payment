import dotenv from "dotenv";
dotenv.config();

import { createCounter, initialModels } from "@Libs/initialSetup";
createCounter();
initialModels();

import App from "app";

const server = new App();

server.start();