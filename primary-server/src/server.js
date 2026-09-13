require("dotenv").config({ path: "./.env" });
const app = require("./app");
const connectDB = require("./config/db");

const startServer = async () => {
  try {
    await connectDB();
    
    const port = process.env.PORT || 8000;
    
    app.listen(port, () => {
      console.log(`\n⚙️ Server is running at port : ${port}`);
    });
    
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });
  } catch (error) {
    console.log("MongoDB connection failed !!! ", error);
    process.exit(1);
  }
};

startServer();
