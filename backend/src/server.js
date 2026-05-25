import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {

  try {

    const [{ default: app }, { connectDB }] = await Promise.all([
      import("./app.js"),
      import("./config/db.js"),
    ]);


    // CONNECT DATABASE
    await connectDB();


    // START SERVER
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error("Failed to start server:");
    console.error(error);

    process.exit(1);
  }

};

startServer();