class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      const { keyword } = this.queryStr;
      if (keyword) {
        const regex = new RegExp(`^${keyword}`, 'i');
        this.query = this.query.find({ name: regex });
      }
      return this;
    }
  
    filter() {
      const queryObj = { ...this.queryStr };
      const excludedFields = ['page', 'sort', 'limit', 'keyword'];
      excludedFields.forEach((field) => delete queryObj[field]);
      this.query = this.query.find(queryObj);
      return this;
    }
  
    sort() {
      if (this.queryStr.sort) {
        const sortBy = this.queryStr.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt'); // Default sort by createdAt in descending order
      }
      return this;
    }
  }
  
  module.exports = ApiFeatures;