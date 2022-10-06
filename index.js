const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const config = require("./config/key");
const app = express();

mongoose
  .connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoDB connected!!");
  })
  .catch((err) => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use("/api/user", require("./routes/user"));
app.use("/api/community", require("./routes/community"));
app.use("/api/writing", require("./routes/writing"));
app.use("/api/comment", require("./routes/comment"));
app.use("/api/like", require("./routes/LikeAndDislike"));

const port = 5000 || process.env.PORT;

app.listen(port, () => {
  console.log("server listening on 5000 port..");
});
