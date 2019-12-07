const Tour = require('../models/tourModel');

// Middleware to validate body...
// exports.validateBody = (req, res, next) => {
//   const { price, name } = req.body;
//   if (!price || !name) {
//     return res.status(400).json({
//       status: 'Fail',
//       message:
//         'Body does not have appropriate fields. Please ensure name and price of tour are included.'
//     });
//   }
//   next();
// };

// Get all tours in database
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      tours
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

// Get a single tour depending on ID
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      tour
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

// Create New Tour
exports.createTour = async (req, res) => {
  // const newTour = new Tour(req.body);
  // newTour.save()
  try {
    const newTour = await Tour.create(req.body);
    newTour.save();
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent.'
    });
  }
};

// Update an existing tour
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour.'
    }
  });
};

// Delete tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
