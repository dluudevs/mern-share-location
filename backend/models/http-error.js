// Models are blueprints - it makes sense that we're using a class here
class HttpError extends Error {
  // constructor method runs whenever class is instantiated
  constructor(message, errorCode) {
    // calls constructor of base class (Error) - inherit its properties and methods
    super(message); // Pass message to base class constructor - as this property already exists in base class we don't need to create it in HttpError
    this.code = errorCode;
  }
}

module.exports = HttpError;
