const { app } = require("./app");

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = server; // ✅ Export server so we can close it in tests