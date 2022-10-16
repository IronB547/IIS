const express = require("express");
require('dotenv').config()
const config = require("./config");

const app = express();
const port = 3000 || process.env.PORT;

const usersRouter = require("./routes/users");
const ticketsRouter = require("./routes/tickets");
const serviceRequestsRouter = require("./routes/serviceRequests");


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

app.use("/users", usersRouter);

app.use("/tickets", ticketsRouter);

app.use("/serviceRequests", serviceRequestsRouter);

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