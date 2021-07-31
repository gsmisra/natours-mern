class APIFeature {
  
    constructor(query, queryString){
      console.log('API Feature constructor is called...')
      this.query = query;
      this.queryString = queryString;
    }
  
  
    filter(){
      const queryObject = {...this.queryString};
      const excludedFields = ['page', 'limit', 'fields', 'sort'];
      
      /* Now remove the above fields from our query object */
      excludedFields.forEach(el => {
        delete queryObject[el];
      });
  
      console.log(this.queryString);
      /* Advanced filtering */
      let queryStr = JSON.stringify(queryObject);
      /* Now we replace the gte, lte, gt, lt with the mongo $get... expressions */
      /* Not sure what the \b is for. The g is for replace all. The ${match} is a callback param of the replace method */
      queryStr = queryStr.replace(/\b( gte|gt|lte|lt|regex )\b/g, match => `$${match}`);
      /* First we build the query. Since we have  */
      //let query =  Tour.find(JSON.parse(queryString)); //Mongoose find() method to get all data form table
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
  
    sorting(){
      /* Then sort the result based on some condition 
      
        Example: localhost:8000/api/v1/tours?sort=price
        localhost:8000/api/v1/tours?sort=price, ratingsAverage
      */
      if(this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');      
        this.query = this.query.sort( sortBy );
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
  
  
    limitFields(){
      if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else{
        this.query = this.query.select(['-__v','']);
      }
  
      return this;
    }
  
  
    paginate(){
      /* Pagination 
        Sample API URl: localhost:8000/api/v1/tours?page=2&limit=10
      */
      let page = this.queryString.page * 1 || 1;   //Here if page value is give in the query take that else, default to 1
      let limit = this.queryString.limit * 1 || 100; //Here if limit is provided in the query then it take that value else default to 100
      let skip = (page-1) * limit;  //Formula for pagination
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }


module.exports = APIFeature;
