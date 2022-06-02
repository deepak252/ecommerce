const express = require("express");
const connectToMongo = require("./db");
const app = express();

const PORT = process.env.PORT || 2000;

connectToMongo();

app.use(express.json());

app.use("/api/auth",require("./routes/auth.js"));
app.use("/api/users", require("./routes/users.js"));
app.use("/api/user", require("./routes/user_profile.js"));


app.listen(PORT,()=>{
    console.log("Server is running on port ",PORT);
})