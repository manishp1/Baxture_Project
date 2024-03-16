const asynchandler = require("express-async-handler");
const User = require("../model/userModel");

const registerUser = asynchandler(async (request, response) => {
  const { id, username, age, hobbies } = request.body;

  const userExist = await User.findOne({ id });
  if (userExist) {
    response.status(400).json({ error: "User with this id already exits" });
  }
  const user = await User.create({
    id,
    username,
    age,
    hobbies,
  });
  if (user) {
    response.status(200).json({ status: "success", user });
  } else {
    response.status(500).json({ error: "failed to create user" });
    throw new Error("Failed to create user");
  }
});

const getUsers = asynchandler(async (request, response) => {
  const users = await User.find();
  if (users.length === 0) {
    response.status(404).json({ error: "Unable to find user" });
    throw new Error("Unable to find user");
  }

  response.status(200).json({ status: "success", users });
});

const getUserById = asynchandler(async (request, response) => {
  const userId = request.params.userId;
  const user = await User.findOne({ id: userId });
  if (!user) {
    response.status(404).json({ error: "user not found with this user-id" });
    throw new Error("user not found with this user-id");
  }
  response.status(200).json({ status: "success", user });
});

const updateUser = asynchandler(async (request, response) => {
  const userId = request.params.userId;
  const { username, age, hobbies } = request.body;
  const users = await User.findOne({ id: userId });
  const updateUser = await User.findOneAndUpdate(
    { id: userId },
    { username, age, hobbies },
    { new: true }
  );
  if (!updateUser) {
    response.status(404).json({ error: "User not found try updating again" });
    throw new Error("User not found try updating again");
  }
  response.status(200).json({ status: "success", updateUser });
});

const deleteUser = asynchandler(async (request, response) => {
  const userId = request.params.userId;

  const deleteUser = await User.findOneAndDelete({ id: userId });
  if (!deleteUser) {
    response.status(404).json({ error: "user not found with this user-id" });
    throw new Error('"user not found with this user-id');
  }
  response
    .status(200)
    .json({ status: "sucess", message: "user deleted successfully" });
});

module.exports = {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
