const validate = (schema) => (req, res, next) =>{
    const {error,value} = schema.validate(req.body, {
        abortEarly: false
        
    })

    if(error){
        return res.json({
            message : 'Validation Error',
            details : error.details.map((d) => d.message)
        })
    }
    req.validate = value;
    // console.log(value)
    next();
}

module.exports = validate