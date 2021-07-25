const fs = require('fs');
const Tour = require('../model/tour-model');
const APIFeature = require('../utils/api-features');


/* Middleware function to add alias to the getAllTour function */
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
}

exports.getAllTours = async (req, res) => {
  try{
    /* Here we are executing the query built above */
    const features = new APIFeature(Tour.find(), req.query) //This APIFeature is a class and it takes two params, (1) Mongo query obj (2) req.query str                .filter()
                      .sorting()
                      .limitFields()
                      .paginate();

    const allTours = await features.query;
    res.status(200).json({
      status: 'success',
      defaultStr: req.defaultShit,
      numberOfResults: allTours.length,
      data: {
        tours: allTours
      }
    });
  } catch(err){
    console.log(`Unable to fetch all tours from Db: ${err}`);
    res.status(404).json({
      status:'failed',
      msg: 'Unable to get all the trades from the db',
      error: err.message
    });
  }
};


exports.getTour = async (req, res) => {
  try{
    const tourData = await Tour.findById(req.params.id);
    res.status(200).json({
      data: tourData
    });
  } catch(err){
    res.status(404).json({
      status: 'failed',
      msg: 'Unable to fetch tour with id '+(req.params.id),
      error: err.message
    })
  }
};


exports.getTourByName = async (req, res) => {
  console.log(`Fetching tour by name req query ${req.query}`);
  try{

    /* One way of querying data is to use mongo objects directly into the query */
    /* const tourDataByName = await Tour.find( {name: {"$regex": req.query.name}});
    res.status(200).json({
      data: tourDataByName
    });  */

    /* Another way of filting data in mongoose */
    console.log(req.query);
    let findTourByNamequery = Tour.find(JSON.parse(JSON.stringify(req.query).replace(/\b(regex)\b/g, match => `$${match}`)));
    let tourDataByName = await findTourByNamequery;

    if(tourDataByName.length === 0){
      res.status(404).json({
        status: 'success',
        msg: `No tour found with query ${JSON.stringify(req.query)}` 
      });
    } else{
      res.status(200).json({
        status: 'success',
        numberOfResults: tourDataByName.length,
        data: tourDataByName
      });
    }
  } catch(err){
    res.status(500).json({
      status: 'failed',
      msg: 'Unable to fetch tour with name '+(req.query),
      error: err.message
    })
  }
};


exports.addTour = async (req, res) => {
  /* const newTour = new Tour({});
  newTour.save(); */
  try{
    const newTour = await Tour.create(req.body);
    res.status(201).send({
      status: 'success',
      data: {
        tour: newTour,
      }
    });
  } catch(err){
    console.log(`Error in adding tour into Db ${err}`);
    res.status(400).json({
      status: 'failed',
      msg: err.message
    });
  }
};

/* Sample API request url
  localhost:8000/api/v1/tours/findByName?name=Slug
*/
exports.updateTour = async (req, res) => {
  try{
    console.log(`Find tour by name containing ${req.query.name}`);
    let updatedTour = await Tour.findOneAndUpdate({name: {"$regex": req.query.name}}, req.body, {
      new: true,
      runValidators: true
    });

    res.status(201).json({
      status: 'success',
      data: updatedTour
    });
  } catch(err){
    res.status(404).json({
      status: 'failed',
      msg: 'Unable to update tour with name '+(req.query.name),
      error: err.message
    });
  }
};


exports.deleteTour = async (req, res) => {
  try{
      let tourToDelete = await Tour.deleteOne({name: {'$regex': req.params.name}});
      res.status(204).send('Successfully deleted!');
  } catch(err){
    res.status(404).json({
      status: 'failed',
      msg: 'Unable to delete tour with name '+(req.params.name),
      error: err.message
    })
  }
};


exports.loadTours = async (req, res) => {
  try{
    fs.readFile(`${__dirname}../../data/tours-simple.json`, (err, full_data) => {
      if(err) console.log('Unable to read dev data file!');
      /* Here I didnt have to use a forEach loop to iterate against each arr tour element 
        as the .create() mongoose method can take an array and automatically add each el to separate document
      */
      Tour.create(JSON.parse(full_data));
      res.status(201).json({
        status: 'success',
        msg: 'Data loaded to mongo',
        numberOfRecords: JSON.parse(full_data).length
      });
    });
  } catch(err){
    console.log(err);
  }
}


exports.deleteAllTours = async (req, res) => {
  try{
      res.status(204).json({
      status: 'success',
      msg: 'All data deleted'});

      /* Passing an empty object means it matches all records and will delete all */
      await Tour.deleteMany();
  } catch(err){
    console.log(err);
  }
}


exports.getTourStats = async (req, res) => {
  try{
    /* 
      Here we create an aggregate pipeline by adding a number of 'stages' in an array within the aggregate function
    */
      const stats = await Tour.aggregate([
        {
          $match: {ratingAverage: {$gte: 4.5}}
        },
        {
          $group: {
            _id: null,
            //_id: {$toUpper: '$difficulty'}, //to get data stats based on 3 different types of difficluty and make the id field to upper case
            numOfTours: {$sum: 1},
            numOfRatins: {$sum: '$ratingsQuantity'},
            avgRating: {$avg: '$ratingAverage'},
            avgPrice: {$avg: '$price'},
            minPrice: {$min: '$price'},
            maxPrice: {$max: '$price'}
          },
          $sort: {
             avgPrice: 1 // This is to sort based on the average price field. And 1 means in ascending order
          },
          /* Here we can see that we can also add repeating conditions to the aggregate pipeline */
          $match:{
            _id: {$ne: 'EASY'}
          }
        }
      ]);

      res.status(200).json({
        status: 'success',
        data: {stats}
      });
  } catch(err){
    res.status(404).json({
      status:'fail',
      message: err.message,
      scenario: 'Unable to get stats from function getTourStats'
    });
  }
}
