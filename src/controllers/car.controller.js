import { Car } from "../models/index.js";
import { appError } from "../utils/errorController.js";
import {
  carCreateValidation,
  carUpdateValidate,
} from "../validations/index.js";

export class carController {
  async create(req, res, next) {
    try {
      const { error, value } = carCreateValidation(req.body);

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
  async getAll(_, res, next) {
    try {
      const allCars = await Car.find()
        .populate("user", "_id fullName role email")
        .exec();

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
      const isExistCar = await Car.findById(id);
      if (!isExistCar) {
        throw new appError("Car not found", 404);
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
}
