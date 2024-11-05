import mongoose from 'mongoose';
import Car from '../models/car.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';
import fs from 'fs-extra'; 

export const createCar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newCar = new Car(req.body);

    if (req.files?.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const image of images) { 
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.mimetype)) {
          throw new Error('Tipo de archivo no permitido');
        }

        const result = await uploadImage(image.tempFilePath, {
          folder: 'cars',
          transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        });

        newCar.images.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          resource_type: result.resource_type
        });

        await fs.unlink(image.tempFilePath);
      }
    }

    const savedCar = await newCar.save({ session });
    await session.commitTransaction();
    res.status(201).json({ success: true, data: savedCar });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error en createCar:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json({ success: true, data: cars });
  } catch (error) {
    console.error('Error en getAllCars:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID de vehículo inválido' });
    }
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Vehículo no encontrado' });
    }
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    console.error('Error en getCarById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID de vehículo inválido' });
    }

    let car = await Car.findById(id).session(session);
    if (!car) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Vehículo no encontrado' });
    }

    const updateData = { ...req.query, ...req.body };

    if (Object.keys(updateData).length === 0 && !req.files) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'No se recibieron datos para actualizar' });
    }

    Object.keys(updateData).forEach(key => {
      if (key !== 'images') {
        car[key] = updateData[key];
      }
    });

    if (req.files?.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

      if (car.images.length + images.length > car.imageLimit) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: 'Excede el límite de imágenes permitido' });
      }

      for (const image of images) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.mimetype)) {
          await session.abortTransaction();
          return res.status(400).json({ success: false, message: 'Tipo de archivo no permitido' });
        }

        try {
          const result = await uploadImage(image.tempFilePath, {
            folder: 'cars',
            transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
          });

          car.images.push({
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type
          });

          await fs.unlink(image.tempFilePath);
        } catch (uploadError) {
          await session.abortTransaction();
          console.error('Error al cargar la imagen:', uploadError);
          return res.status(500).json({ success: false, message: 'Error al cargar la imagen', error: uploadError.message });
        }
      }
    }

    const updatedCar = await car.save({ session });
    await session.commitTransaction();
    res.status(200).json({ success: true, data: updatedCar });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error en updateCar:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const deleteCar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de vehículo inválido');
    }

    const car = await Car.findById(id).session(session);
    if (!car) {
      throw new Error('Vehículo no encontrado');
    }

    for (const image of car.images) {
      await deleteImage(image.public_id);
    }

    await Car.findByIdAndDelete(id).session(session);
    await session.commitTransaction();
    res.status(200).json({ success: true, message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error en deleteCar:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};
