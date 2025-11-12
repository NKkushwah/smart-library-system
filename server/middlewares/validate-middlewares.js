const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next();
  } catch (err) {
    if (err.issues && err.issues.length > 0) {
      const status = 422;
      const message = 'fill the input properly';
      const extraDetails = err.issues[0].message;

     const error ={
      status,
      message,
      extraDetails,
     };

      console.log(error);
      //return res.status(400).json({ msg: message });
      next(error);
    }

    
    console.error("Unexpected Validation Error:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = validate;
