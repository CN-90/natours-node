const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

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

exports.aliasTopTours = (req, body, next) => {
  req.query.limit = '5';
  req.query.sort = '-averRatings, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Get all tours in database
exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

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
      message: err
    });
  }
};

// Update an existing tour
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        updatedTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      data: {
        message: err
      }
    });
  }
};

// Delete tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Tour deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed to delete Tour',
      message: err
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          // _id: '$difficulty',
          _id: '$ratings',
          numOfTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed to delete Tour',
      message: err
    });
  }
};
