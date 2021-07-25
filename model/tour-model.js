const mongoose = require('mongoose');
const slugify = require('slugify');


/* Tours Schema - This is basically the data model of the request json
    We have also added 'data validators' like required, unique, type

    Structure of the mongoose schema model
    const toursSchema = new mongoose.Schema({Here goes the schema definition },{Here goes the schema properties})
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
      required: [false, 'Tour cover image is required']
      //select: false
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    slugObj: String,  //This is a slug data comming from the toursSchema.pre('save', function(next) middleware,
    secretTour: {
      type: Boolean,
      default: false
    }
  }, {
    /* Here we are setting the schema properties. */
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });


  /* 
    This is a virtual property. 
    Note here the function defined within the get() is not an arrow fn, but a normal fn.
    This is because we need to use the this. keyword. In an arrow fn we cannot use this. keyword.
    Here this. will point to the tourSchema fields
  */
  toursSchema.virtual('durationWeeks').get(function(){
    return (this.duration/7).toFixed(2);
  })


  toursSchema.virtual('randomVirtualData').get(function(){
    return 'some virtual shit into the response';
  })


                                                    /* Mongoose Middleware */

  /* Document middleware
    This will run before the .save() command and the .create() command always.
    But will NOT be triggered before the insertMany() command.
    The this. keyword will point to the currently created document.
  */
  toursSchema.pre('save', function(next){
    //console.log(this);
    this.slugObj = slugify(this.name, { lower: true });
    next();
  });

  toursSchema.pre('save', function(next){
    console.log(`Another pre save() hook`);
    next();
  });

  /* Same as the above we will use the schema.post() middleawre.
    Here the post() middleware will have access to both next() and document() objects
    Here we dont have access to the this keyword
  */
  toursSchema.post('save', function(document, next){
    console.log(document);
    next();
  });

  toursSchema.post('save', function(document, next){
    console.log(`This is another post save() hook!`);
    next();
  });

  /* 
    Query Middleware - This middleware hook will run before every find() method 
    toursSchema.pre(/^find/, function(next) >>> Here /^find/ is a regular expression for any query starting with the str find
  */
  toursSchema.pre('find', function(next){
    this.find({ 'secretTour': {'$ne': true} });
    this.start = Date.now();
    next();
  });

  toursSchema.pre('findOne', function(next){
    this.find({ 'secretTour': {'$ne': true} });
    next();
  });

  toursSchema.post(/^find/, function(doc, next){
    console.log(doc);
    console.log(` >>>   Query time taken is ${ Date.now() - this.start } ms!`);
    next();
  });

  /* 
    Aggregation middleware 
    This will allow us to run hooks before and after aggregation
  */


  /* Adding schema to a mongoose model */
const TourModel = mongoose.model('Tour', toursSchema);

module.exports = TourModel;