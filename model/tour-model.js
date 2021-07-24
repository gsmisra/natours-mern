const mongoose = require('mongoose');

/* Tours Schema - This is basically the data model of the request json
    We have also added 'data validators' like required, unique, type
*/
const toursSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: [true, 'Tour Name should be unique'],
      required: true
    },
    duration: {
      type: Number,
      required: [true, 'Tour duration is mandatory']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour group size is mandatory']
    },
    difficulty: {
      type: String,
      required: [true, 'Tour difficulty is mandatory']
    },
    ratingAverage: {
      type: Number,
      default: 4.0
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price']
    },
    discount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour summary is required']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'Tour cover image is required']
      //select: false
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],

  });

  /* Adding schema to a mongoose model */
const TourModel = mongoose.model('Tour', toursSchema);

module.exports = TourModel;