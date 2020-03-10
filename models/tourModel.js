const mongoose = require('mongoose');
const slugify = require('slugify');
const validators = require('validator');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less than or equal to 40 characters'
      ],
      minlength: [
        10,
        'A tour name must have more than or equal to 10 characters'
      ],
      validate: {
        // [validators.isAlpha, 'Tour name must contain only letters.']
        validator: function(tourName) {
          return validators.isAlpha(tourName.replace(/ /g, ''));
        },
        message: 'Tour name must contain only letters'
      }
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      // custom validator
      validate: {
        validator: function(discount) {
          // THIS only points to current doc on NEW document and not update.
          return discount < this.price;
        },
        message: `Discount price {VALUE} cannot be higher than price ${this.price}`
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enums: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// toursSchema.index({ price: 1 });
toursSchema.index({ price: 1, ratingsAverage: -1 });
toursSchema.index({ slug: 1 });
toursSchema.index({ startLocation: '2dsphere' });

// In Mongoose, a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents.
toursSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Virtual populate reviews
toursSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // field name on the model we want to populate
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
toursSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// // add users as embedded documents.
// toursSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(
//     async userId => await User.findById(userId)
//   );
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// QUERY MIDDLWARE regex for all routes that begin with find.
toursSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

toursSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

// AGGREGATION MIDDLEWARE
// toursSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({
//     $match: { secretTour: { $ne: true } }
//   });
//   next();
// });

toursSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  //   console.log(docs);
  next();
});

// toursSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
