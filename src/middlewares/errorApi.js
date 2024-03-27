class APIError extends Error {
    
    constructor (msg, status){
        super(msg);
        this.status
    }

    static badRequest(msg = "Invalid Request", status = 400){
        return new this(msg, status);
    }
    static notFound = (msg = "No Records Found", status = 404)=>{
        return new this(msg, status)
    }
    static unauthenticated = (msg = "Please log in to have access", status = 401)=>{
        return new this(msg, status)
    }
    static unauthorized = (msg = "Access denied", status = 403)=>{
        return new this(msg, status)
    }
}

module.exports = {
    APIError,
}