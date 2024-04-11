const { connect, default: mongoose } = require("mongoose");
const app = require("./src/app");
const { config } = require("./src/config");
const AccountModel = require("./src/models/account");
const {engine} =    require("express-handlebars")
const router = require("./src/routes");
const { errorHandler, notFound } = require("./src/middlewares/error.middleware");


app.engine('handlebars', engine({extname: '.handlesbars'}));
app.set('.view engine', '.handlesbars');
app.set('.views', '../src/views')

app.use("/api/v1", router)
app.all("*", notFound)
app.use(errorHandler)
app.listen(config.PORT, async()=>{
try{
    //connect to database
    console.log("connecting to database...");
    // mongoose.set("StrictQuery", true);
    connect(config.DB_URL)
    console.log("database connected successfully...")

    console.log(`server is running on localhost:${config.PORT}`)
}catch(error){
    console.error(error);
    process.exit(-1);
}
})