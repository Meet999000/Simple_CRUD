module.exports = (app) => {
  const customer = require("./routes/customer");

  app.use("/api/v1/customer", customer);
};
