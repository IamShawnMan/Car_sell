import { Car, Parking } from "../models/index.js";
import { appError } from "../utils/errorController.js";
import { transporter } from "../utils/mailer.js";
import { bookedMail } from "../utils/createMail.js";

export class parkingController {
  async create(req, res, next) {
    try {
      const data = req.body;
      const slot = await Parking.findOne({ slotNumber: data.slotNumber });

      console.log(slot);

      if (slot) {
        throw new appError("This slot is created already", 400);
      }
      const parking = new Parking(data);
      parking.save();

      res.status(201).json({
        status: "success",
        message: "New parking added",
        data: parking,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAll(_, res, next) {
    try {
      const allParking = await Parking.find()
        .populate("car bookedBy", "color plateNumber fullName")
        .exec();

      res.json({
        status: "success",
        message: "All places",
        data: allParking,
      });
    } catch (error) {
      next(error);
    }
  }
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const parking = await Parking.findById(id)
        .populate("car bookedBy", "color plateNumber fullName")
        .exec();

      if (!parking) {
        throw new appError("Parking not found", 404);
      }

      res.json({
        status: "success",
        message: "Parking by id",
        data: parking,
      });
    } catch (error) {}
  }
  async book(req, res, next) {
    try {
      const { id } = req.params;
      const { car } = req.body;
      const parking = await Parking.findById(id);

      if (!parking) {
        throw new appError("Parking not found", 404);
      }
      if (parking.isBooked) {
        throw new appError("This place is not available", 400);
      }
      if (!car) {
        throw new appError("You have to enter car", 400);
      }

      const usersCar = await Car.findById(car);

      console.log(usersCar.user.toString(), req.user.id);

      if (!usersCar || usersCar.user.toString() !== req.user.id) {
        throw new appError(
          "Car not found or you have not added this car to your cars list",
          400
        );
      }

      const bookingData = {
        isBooked: true,
        bookedBy: req.user.id,
        car,
      };

      const bookedParking = await Parking.findByIdAndUpdate(id, bookingData, {
        new: true,
      })
        .populate("car bookedBy", "color plateNumber fullName")
        .exec();

      const mailData = {
        email: req.user.email,
        name: req.user.name,
        slotNumber: parking.slotNumber,
        plateNumber: usersCar.plateNumber,
        model: usersCar.carModel,
      };

      transporter.sendMail(bookedMail(mailData), function (err, info) {
        if (err) {
          throw new appError(`Error on sending mail: ${err.message}`, 400);
        } else {
          console.log(info);
        }
      });

      res.json({
        status: "success",
        message: "Place is booked successfully",
        data: bookedParking,
      });
    } catch (error) {
      next(error);
    }
  }
  async unbook(req, res, next) {
    try {
      const { id } = req.params;
      const parking = await Parking.findById(id);
      const user = req.user;

      if (!parking) {
        throw new appError("Parking not found", 404);
      }
      if (user.id !== parking.bookedBy && user.role !== "admin") {
        throw new appError("You can not change the status", 400);
      }

      res.send(parking);
    } catch (error) {
      next(error);
    }
  }
}
