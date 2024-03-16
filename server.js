// server.js

const express = require("express");
const cluster = require("cluster");
const os = require("os");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./router/userRoute");

dotenv.config();
var PORT = process.env.PORT;

if (cluster.isMaster) {
  const numCPUs = os.cpus().length - 1;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ workerId: i + 1 });
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork({ workerId: worker.id });
  });
} else {
  const app = express();
  connectDB();
  const workerId = process.env.workerId || 1;
  app.use(express.json());
  const numWorkers = os.cpus().length - 1;
  let currentWorker = 1;

  app.use("/api", (req, res, next) => {
    req.workerId = currentWorker;
    currentWorker = (currentWorker % numWorkers) + 1;
    next();
  });
  app.use("/api", userRouter);

  PORT = Number(PORT) + Number(workerId);

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
  });
}
