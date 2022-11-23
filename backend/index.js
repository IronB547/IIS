const express = require("express");
require('dotenv').config()
const config = require("./config");
const compression = require('express-compression')

const app = express();
const port = process.env.PORT || 3000;

const usersRouter = require("./routes/users");
const ticketsRouter = require("./routes/tickets");
const serviceRequestsRouter = require("./routes/serviceRequests");

// app.use(compression({ filter: shouldCompress, brotli: { enabled: true, zlib: { } } }))
 
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
 
  // fallback to standard filter function
  return compression.filter(req, res)
}


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

app.use("/", compression({ filter: shouldCompress, brotli: { enabled: true, zlib: { } } }), express.static("../frontend/dist"));

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});