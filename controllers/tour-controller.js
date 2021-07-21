const fs = require('fs');
const Tour = require('../model/tour-model');

/* Read file outside the event loop */
/* 
  const tours = JSON.parse(
  fs.readFileSync(`${__dirname}../../data/tours-simple.json`, (err, data) => {
    if (err) console.log('Unable to read file');
    if (err) return 'No data';
  })
); 
*/

/* Middleware to check if the data from the file is valid or not */
/* exports.checkTourData = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      msg: 'request json body must contain name and price details',
      sampleData: {
        name: 'middleware check',
        price: 1000,
        duration: 12,
        maxGroupSize: 25,
        difficulty: 'medium',
        ratingsAverage: 4.7,
        ratingsQuantity: 37,
      },
    });
  }

  next();
}; */


/* This function is not needed anymore as the data validation is now done in the mongoose data model layer */
/* Middleware to check the id of the search param is valid */
/* exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).send({
      status: 'failed',
      msg: 'tour id searched is invalid',
      source: 'checkid middleware - tour router',
    });
  }

  next();
}; */

exports.getAllTours = async (req, res) => {
  try{
    /* 
      IMPORTANT: Here we use the {...} to 1st destructure the object and then
       {} will store all the destructured objects in one new object.
    */
    const queryObject = {...req.query};
    const excludedFields = ['page', 'limit', 'fields', 'sort'];
    
    /* Now remove the above fields from our query object */
    excludedFields.forEach(el => {
      delete queryObject[el];
    });

    console.log(req.query);

    /* Advanced filtering */
    let queryString = JSON.stringify(queryObject);

    /* Now we replace the gte, lte, gt, lt with the mongo $get... expressions */
    /* Not sure what the \b is for. The g is for replace all. The ${match} is a callback param of the replace method */
    queryString = queryString.replace(/\b( gte|gt|lte|lt|regex )\b/g, match => `$${match}`);
        
    /* First we build the query. Since we have  */
    let query =  Tour.find(JSON.parse(queryString)); //Mongoose find() method to get all data form table

    /* Then sort the result based on some condition */
     if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');      
        qurey = query.sort( sortBy );
    } else {
      query = query.sort('-createdAt');
    }

    /* Field limitting */
    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else{
      query = query.select('-__v');
    }


    console.log(`Query: ${JSON.stringify(queryString)}`);

    /* Here we are executing the query built above */
    const allTours = await query;

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
      res.status(500).json({
        status:'failed',
        msg: 'Unable to get all the trades from the db',
        error: err
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
      error: err
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
      msg: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try{
    let updatedTour = await Tour.findOneAndUpdate({name: {"$regex": req.params.name}}, req.body, {
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
      msg: 'Unable to update tour with name '+(req.params.name),
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