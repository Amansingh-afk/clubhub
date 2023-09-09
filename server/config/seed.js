const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

mongoose.connect("mongodb+srv://clubhub:t6ugwdhi@clubhub1.ehe7ety.mongodb.net/?retryWrites=true&w=majority", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
  console.log("Connected to the database.");

  try {
    // Remove existing users from the database
    await User.deleteMany();

    const super_admin = [
      {
        name: "SMS Admin",
        username: "sms",
        email: "sms@varanasi.com",
        password: "superadmin",
        role: "super_admin",
        phone_no: 1234567890,
        avatar: {
          public_id: "sms--logo",
          url: "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png",
        },
      },
      {
        name: "SMS Admin2",
        username: "sms2",
        email: "sms2@varanasi.com",
        password: "superadmin",
        role: "super_admin",
        phone_no: 1234567890,
        avatar: {
          public_id: "sms--logo",
          url: "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png",
        },
      },
    ];

    // Create a hashed password
    const hashedPassword = await bcrypt.hash("superadmin", 10);

    const users = super_admin.map((user) => ({
      ...user,
      password: hashedPassword,
    }));

    // Insert the dummy data into the database
    await User.insertMany(users);

    console.log("Database seeded successfully.");
  } catch (err) {
    console.error(err);
  }

  mongoose.connection.close();
});
