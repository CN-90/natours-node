const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// middleware function to make sure ID is valid.
exports.checkID = (req, res, next, id) => {
  if (id > tours.length) {
    return res.status(404).json({ status: 'Fail', message: 'Invalid ID' });
  }
  next();
};

exports.validateBody = (req, res, next) => {
  const { price, name } = req.body;
  if (!price || !name) {
    return res.status(400).json({
      status: 'Fail',
      message:
        'Body does not have appropriate fields. Please ensure name and price of tour are included.'
    });
  }
  next();
};

// Get all tours in database
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

// Get a single tour depending on ID
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

// Create New Tour
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).send({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
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
