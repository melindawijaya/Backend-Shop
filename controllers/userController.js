const { where } = require("sequelize");
const { Users } = require("../models");
const { Op } = require("sequelize");

const createUsers = async (req, res) => {
  const { name, age, role, address } = req.body;

  try {
    const newUser = await Users.create({
      name,
      age,
      role,
      address,
    });

    res.status(201).json({
      status: "Success",
      message: "Success create new user",
      isSuccess: true,
      data: {
        newUser,
      },
    });
  } catch (error) {
    console.log(error.name);
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "Failed",
        message: errorMessage[0],
        isSuccess: false,
        data: null,
      });
    } else if (error.name === "SequelizeDatabaseError") {
      return res.status(400).json({
        status: "Failed",
        message: error.message || "Database error",
        isSuccess: false,
        data: null,
      });
    } else {
      return res.status(500).json({
        status: "Failed",
        message: "An unexpected error occurred",
        isSuccess: false,
        data: null,
      });
    }
  }
};

const findUsers = async (req, res, next) => {
  try {
    const { userName, age, role, page, size } = req.query;
    
    const condition = {};
    if (userName) condition.name = { [Op.iLike]: `%${userName}%` };
    if (age) condition.age = age;
    if (role) condition.role = { [Op.iLike]: `%${role}%` };

    const pageSize = parseInt(size) || 10;
    const pageNum = parseInt(page) || 1;
    const offset = (pageNum - 1) * pageSize;

    const totalCount = await Users.count({ where: condition});

    const users = await Users.findAll({
      attributes: ["name", "age", "role"],
      where: condition,
      limit: pageSize,
      offset
    }); 

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      status: "Success",
      message: "Success get shops data",
      isSuccess: true,
      data: {
        totalData: totalCount,
        users,
        pagination: {
          page: pageNum,
          size: pageSize,
          totalPages
        }
      },
    });
  } catch (err) {console.log(err);}
};

const findUserById = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error.name);
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(400).json({
        status: "Failed",
        message: errorMessage[0],
        isSuccess: false,
        data: null,
      });
    }

    res.status(500).json({
      status: "Failed",
      message: error.message,
      isSuccess: false,
      data: null,
    });
  }
};

const updateUser = async (req, res, next) => {
  const { name, age, role, address, shopId } = req.body;
  try {
    await Users.update(
      {
        name,
        age,
        role,
        address,
        shopId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      status: "Success",
      message: "sukses update user",
    });
  } catch (err) {}
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    await Users.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "sukses delete user",
    });
  } catch (err) {}
};

module.exports = {
  createUsers,
  findUsers,
  findUserById,
  updateUser,
  deleteUser,
};
