const { default: mongoose } = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err?.message ?? "Failed DB connected.");
  });
