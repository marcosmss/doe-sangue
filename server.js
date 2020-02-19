const express = require("express");
const nunjucks = require("nunjucks");
const Pool = require("pg").Pool;

const server = express();

server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));

const db = new Pool({
  user: "postgres",
  password: "13461024m",
  host: "localhost",
  port: 5432,
  database: "doe"
});

nunjucks.configure("./", {
  express: server,
  noCache: true
});

server.get("/", (req, res) => {
  db.query("SELECT * FROM donors", (err, result) => {
    if (err) return res.send("Erro of database.");

    const donors = result.rows;
    return res.render("index.html", { donors });
  });
});

server.post("/", (req, res) => {
  const data = req.body;

  if (data.name === "" || data.email === "" || data.blood === "") {
    return res.send("All fields is required.");
  }

  const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`;
  const values = [data.name, data.email, data.blood];
  console.warn(values);
  db.query(query, values, err => {
    if (err) return res.send("error in database.");

    return res.redirect("/");
  });
});

server.listen(3000, () => {
  console.log("Run server");
});
