const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const spaceRoutes = require("./routes/spaceRoute");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reactionRoutes = require("./routes/reactionRoutes");
const followingRoutes = require("./routes/followingRoutes");
const app_route = require("./routes/app-routes");
const admin_route = require("./routes/admin-routes");

app.use(cors({ origin: " http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "Hello, welcome to my remake of quora blog API server🫡",
  });
});

app.use("/admin", admin_route);
app.use("/api/v1", userRoutes);
app.use("/api/v1", postRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1", reactionRoutes);
app.use("/api/v1", followingRoutes);
app.use("/api", spaceRoutes);
app.use("/", app_route);

app.use((err, req, res, next) => {
  if (err) {
    res.json({ message: "opps soemthing went wrong!" });
  }
});

module.exports = app;
