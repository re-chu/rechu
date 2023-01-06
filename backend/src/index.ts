import server from "./server";
import "./socket";
require("dotenv").config();

import { dataSource } from "./db";
dataSource
  .initialize()
  .then(() => {
    console.log("✅ DB 테이블 생성 완료! (by TypeORM)");
  })
  .catch((err) => {
    console.log("Error :", err);
  });

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("✅ Server Connecting Port, ", PORT));
