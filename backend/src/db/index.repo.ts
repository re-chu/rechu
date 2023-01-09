// import { DataSource } from "typeorm";
// // const mysql2 = require("mysql2/promise");
// import mysql from "mysql2/promise";
// require("dotenv").config();

// // mysql2 Connect
// export const db = mysql.createPool({
//   host: "13.124.107.224",
//   user: "team6",
//   password: "11111",
//   database: "company",
//   port: 3306,
// });

// db.getConnection()
//   .then(() => console.log("✅ mysql2 로 DB 접속!"))
//   .catch((err) => console.log("error!!!!!!!", err));

// // type ORM Connect
// export const dataSource = new DataSource({
//   type: "mysql",
//   host: "13.124.107.224",
//   username: "team6",
//   password: "11111",
//   database: "company",
//   port: 3306,
//   entities: ["src/db/schemas/*.entity.ts", "src/db/schemas/*.schema.ts"],
//   logging: false,
//   synchronize: true,
// });

// export * from "./auth.repo";
// export * from "./user.repo";
// export * from "./admin.repo";
// export * from "./resume.repo";
