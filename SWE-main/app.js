const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const indexRouter = require('./routes/index')
const employerRouter = require('./routes/employers')
const studentRouter = require('./routes/students')
const messageRouter = require('./routes/message')
const profileRouter = require('./routes/profile')
//const profileRouter = require('./routes/profileRouter');
const employerAuthRouter = require('./routes/employerAuthRoute')
const studentAuthRouter = require('./routes/studentAuthRoute')
const { requireEmpAuth, requireEmployerRole } = require('./middleware/employerAuthMiddleware')
const { requireStudAuth, requireStudentRole } = require('./middleware/studentAuthMiddleware')
const cookieParser = require('cookie-parser')
const searchJob = require('./routes/search');

const port = 5000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTES
app.use("/", indexRouter);
app.use("/employers", requireEmpAuth, requireEmployerRole, employerRouter);
app.use("/students", requireStudAuth, requireStudentRole, studentRouter);
app.use("/employer-auth", employerAuthRouter)
app.use("/student-auth", studentAuthRouter)
app.use("/message", messageRouter);
//app.use("/profile", profileRouter);
//app.use("/profile", profileRouter)
app.use("/student/profile", requireStudAuth, requireStudentRole, profileRouter);
app.use("/employer/profile", requireEmpAuth, requireEmployerRole, profileRouter);
app.use("/search",searchJob);

// View engine setup - for displaying the dynamic front end content
app.set("views", path.join(__dirname, "view"));
app.set("view engine", "pug");
app.use(express.static('public'));


// Set up mongoose connection
mongoose.set("strictQuery", false);

const mongoDB = "mongodb://localhost:27017/jobportal";
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log('connected to MongoDb')
}

//START THE SERVER  
app.listen(port, () => {
    console.log(`the server is listening at http://localhost: ${port}`)
})
