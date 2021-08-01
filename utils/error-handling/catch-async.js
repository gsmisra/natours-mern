/* Catch statement is separated from the controller funcion */

module.exports = fn => {
  return (req, res, next) => {
      fn( req, res, next).catch(next);
  }
}