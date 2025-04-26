import { Car } from "../models/index.js";
import { appError } from "../utils/errorController.js";
import {
  carCreateValidation,
  carUpdateValidate,
} from "../validations/index.js";

export class carController {
  async create(req, res, next) {
    try {
      const user = req.user.id;
      const data = { ...req.body, user };

      const { error, value } = carCreateValidation(data);

      if (error) {
        throw new appError(error.message, 400);
      }

      const { plateNumber } = value;

      const car = await Car.findOne({ plateNumber });

      if (car) {
        throw new appError("This car already exist", 400);
      }

      const newCar = new Car(value);
      await newCar.save();

      res.status(201).json({
        status: "success",
        message: "New car created",
        data: newCar,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAll(req, res, next) {
    try {
      const user = req.user;

      let allCars;

      if (user.role === "admin") {
        allCars = await Car.find()
          .populate("user", "_id fullName role email")
          .exec();
      } else if (user.role === "user") {
        const cars = await Car.find(
          { user: user.id },
          "model plateNumber color"
        );

        allCars = {
          ...user,
          cars,
        };
      } else {
        throw new appError("Forbidden", 400);
      }

      res.json({
        status: "success",
        message: "All cars",
        data: allCars,
      });
    } catch (error) {
      next(error);
    }
  }
  async getOne(req, res, next) {
    try {
      const { id } = req.params;

      const car = await Car.findById(id)
        .populate("user", "_id fullName role email")
        .exec();

      if (!car) {
        throw new appError("Car not found", 404);
      }

      if (req.user.role === "user" && req.user.id !== car.user.id) {
        throw new appError("You can not see this car", 400);
      }

      res.json({
        status: "success",
        message: "Car by id",
        data: car,
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const user = req.user;

      const isExistCar = await Car.findById(id);

      if (!isExistCar) {
        throw new appError("Car not found", 404);
      }

      if (user.role === "user" && user.id !== isExistCar.user) {
        throw new appError("You can not see this car", 400);
      }

      const { error, value } = carUpdateValidate(req.body);

      if (error) {
        throw new appError(error.message, 400);
      }

      const { plateNumber } = value;

      if (plateNumber) {
        const car = await Car.findOne({ plateNumber });

        if (car) {
          throw new appError("Car with this Plate Number is exist");
        }
      }

      const car = await Car.findByIdAndUpdate(id, value, { new: true });

      res.json({
        status: "success",
        message: "Car updated",
        data: car,
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const car = await Car.findById(id);

      if (!car) {
        throw new appError("Car not found", 404);
      }

      await Car.findByIdAndDelete(id);
      res.json({
        status: "success",
        message: "Car deleted",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
}
