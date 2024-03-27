//when route is not defined
exports.notFound = (_req, res, _next) =>{
    const err = new Error("Route Not Found")               //used to impliment error
    err.status =  404;
    res.status(err.status).json({error: err.message})
}

//every error that occurs will be passed to this error
exports.errorHandler = (err, _req, res, _next) =>{
    if(err.error){                                                  //used for catching error
        return res.status(err.status || 404).json({error: err.message})
    }
    res.status(err.status || 500).json({error: err.message || "Unknown error occured"})
}