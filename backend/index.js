const express = require("express");
require('dotenv').config()
const config = require("./config");

const app = express();
const port = process.env.PORT || 3000;

const usersRouter = require("./routes/users");
const ticketsRouter = require("./routes/tickets");
const serviceRequestsRouter = require("./routes/serviceRequests");

app.set("query parser", "simple");

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.get("/api", (req, res) => {
	console.log(req.query);

	res.json({ message: "ok" });
});

app.use("/api/users", usersRouter);

app.use("/api/tickets", ticketsRouter);

app.use("/api/requests", serviceRequestsRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	console.error(err.message, err.stack);
	res.status(statusCode).json({ message: err.message });
	return;
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});