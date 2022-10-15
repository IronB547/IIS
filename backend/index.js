const express = require("express");
const config = require("./config");

const app = express();
const port = 3000 || process.env.PORT;
const db_password = process.env.DB_PASSWORD;



app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
    console.log(req.query);

    res.json({ message: "ok" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});