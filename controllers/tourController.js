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
    // build query

    // 1. filtering request
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // advanced filtering.

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2. sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      //sort('price ratingsAverage')
    } else {
      query = query.sort('-createdAt');
    }

    // 3. Field Limiting

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4. Pagination

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numOfTours = await Tour.countDocuments();
      if (skip >= numOfTours) {
        throw new Error('This page does not exist');
      }
    }

    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // execute query
    const tours = await query;

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
