import express from "express";
import authrouter from "./routes/auth.js";
import cors from "cors";
const app = express();
app.use(express.json());

app.get("/health ", (req, res) => {
  res.send("Server is running ");
});
app.use("/api/v1", authrouter);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});