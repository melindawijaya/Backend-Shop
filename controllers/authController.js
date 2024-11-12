const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Auths, Users } = require("../models");

const register = async (req, res, next) => {
  try {
    const { name, email, password, age, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      name,
      email,
      age,
      address,
      role,
    });

    await Auths.create({
      userId: newUser.id,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "Success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Failed",
      message: "Registration failed",
      isSuccess: false,
      data: null,
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await Auths.findOne({
      where: { email: req.body.email },
      include: [{ model: Users, as: "user" }],
    });

    console.log(user);

    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Email not registered",
        isSuccess: false,
        data: null,
      });
    }
    

    const auth = await Auths.findOne({
      where: { userId: user.id },
    });

    if (!auth) {
      return res.status(404).json({
        status: "Failed",
        message: "Authentication record not found",
        isSuccess: false,
        data: null,
      });
    }

    if (bcrypt.compareSync(password, auth.password)) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRED,
        }
      );

      return res.status(200).json({
        status: "Success",
        message: "Login success",
        isSuccess: true,
        data: {
          username: user.name,
          token,
        },
      });
    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Incorrect password",
        isSuccess: false,
        data: null,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Failed",
      message: "Login failed",
      isSuccess: false,
      data: null,
    });
  }
};

const authenticate = async (req, res) => {
  try {
    res.status(200).json({
      status: "Success",
      data: {
        user: req.user,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Failed",
      message: "Authentication failed",
      isSuccess: false,
      data: null,
    });
  }
};

module.exports = {
  register,
  login,
  authenticate,
};
