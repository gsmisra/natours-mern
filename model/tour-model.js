const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');


/* Tours Schema - This is basically the data model of the request json
    We have also added 'data validators' like required, unique, type

    Structure of the mongoose schema model
    const toursSchema = new mongoose.Schema({Here goes the schema definition },{Here goes the schema properties})
*/
const toursSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: [true, 'Tour Name should be unique'],
      required: true,
      maxlength: [40, 'Err Msg: Tour name must have <= 40 chars'],   //This is a mongooes internal data validator
      minlength: [10, 'Err Msg: Tour name must have >= 10 chars']   //This is a mongooes internal data validator,
      //validate: [validator.isAlpha, 'Err Msg: Tour name should contain only characters and no numbers'] // This from an external lib called validator
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
      required: [true, 'Tour difficulty is mandatory'], 
      enum: { values: ['easy','medium','difficult'],      //This is a mongooes internal data validator
              message: 'Diffiulty should be either easy, medium, diffucult'   
            }
    },
    ratingAverage: {
      type: Number,
      default: 4.0,
      min: [1, 'Err msg: Rating must be above 1 to 5'], //This is a mongooes internal data validator
      max: [5, 'Err Msg: Rating must be within 1-5']    //This is a mongooes internal data validator
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price']
    },
    discount: {type: Number,
      validate: {
        validator: function(val) {                  // This is a custom validator
          return val < this.price;                  /* Here val is the discount passed into the function as a param */
        },                                          /* Here the .this() keyword will work only on create function as it points to the new or current document and not on update funciton  */
        message: 'Error Msg: Discount ({VALUE}) should be less than tour  price'
      }
    },
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

  //This part is not build yet


  /* Adding schema to a mongoose model */
const TourModel = mongoose.model('Tour', toursSchema);

module.exports = TourModel;