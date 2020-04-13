const Validator = require('validator'),
        isEmpty = require('is-empty');

/**
 * Takes in auction form text inputs from client-side and checks validity
 */
function validateAuctionInput(data) {
  let errors = {};

  // Convert empty fields to an empty string ('validator' functions only work with strings)
  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.startingBid = !isEmpty(data.startingBid) ? data.startingBid : "";
  // If this field is true, 
  if(data.hasBuyItNow) {
    data.buyItNow = !isEmpty(data.buyItNow) ? data.buyItNow : "";
  }

  // Title validation
  if(Validator.isEmpty(data.title)) {
    errors.title = 'Title field is required';
  }

  // Description validation
  if(Validator.isEmpty(data.description)) {
    errors.description = 'Description field is required';
  }

  // Starting bid validation
  if(Validator.isEmpty(data.startingBid)) {
    errors.startingBid = 'Starting-bid field is required'
  } else if(!Validator.isNumeric(data.startingBid)) {
    errors.startingBid = 'Price requires a numeric value'
  }

  return {
    errors, 
    isValid: isEmpty(errors)
  }
}

module.exports = validateAuctionInput;