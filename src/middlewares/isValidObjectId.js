var ObjectId = require('mongoose').Types.ObjectId;
/**
 * Middleware function used to verify if req.params has a valid mongoose id
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const isValidObjectId = (req, res, next) => {
  const { id } = req.params;
  // check if req.params has a valid mongoose id
  if (!ObjectId.isValid(id)) {
    // reply with error and 400 code
    res.status(400).json({
      message: "Invalid id",
      status: 400,
      data: null
    });
  } else {
    // if found, continue with next
    next();
  }
}
// export function
module.exports = isValidObjectId;