class RecordNotFoundException extends Error {
    constructor(message = 'Record not found') {
      super(message);
      this.name = 'RecordNotFoundException';
      this.statusCode = 404;
    }
}
  
module.exports = RecordNotFoundException;