module.exports.getProduct = async (event) =>  {

  const eventObj = event.body;
  return {
    statusCode: 200,
    body: JSON.stringify({ message: JSON.parse(eventObj) })
  };
}