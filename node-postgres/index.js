const express = require('express')
const token_gen = require('./token-gen')
const app = express()
const port = 3001

const users = require('./models/users')
var cors = require('cors');
const { response } = require('express')

app.use(cors());

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.options('/*', (_, res) => {
  res.sendStatus(200);
});

app.get('/board/mod', (req, res) => {
  users.getUsers()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.post('/signin', (req, res) => {
  console.log("ajung")
  console.log("req: " + req.body.username);
  users.getUser(req.body)
  .then(response => {
    
    console.log(response)
    const roles = "ROLE_MODERATOR"
      response.accessToken =token_gen.token();
      
      response.roles = roles;
      console.log("ACces token: " + response.accessToken);
    console.log("response: " + response)

    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/signup', (req, res) => {
  console.log("ajung")
  users.createUser(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/remove/prof',(req,res) => {
  
  users.removeProf(req.body.index)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.post('/add/prof',(req,res) => {
  
  users.addProf(req.body.index)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.delete('/user/removeCourse/:idUser/:idCourse', (req, res) => {
  users.removeCourse(req.params.idUser,req.params.idCourse)
  .then(response => {
  
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.post('/user/joinCourse/:idUser/:idCourse', (req, res) => {
  users.joinCourse(req.params.idUser,req.params.idCourse)
  .then(response => {
  
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})


app.delete('/user/:idUser/:idCourse', (req, res) => {
  users.deleteUser(req.params.idUser,req.params.idCourse)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/teacher/courses', async function(req, res)  {
    if(response!= 'undefined'){
      let response =await users.getCoursesNames(req.body.index);
        res.status(200).send(response);
      
    }
   
  
  
})
app.post('/teacher/addCourse',async function(req, res)  {
  if(response!= 'undefined'){
    let response =await users.addCourse(req.body.data);
      res.status(200).send(response);
    
  }
})
app.post('/teacher/sendGrades',async function(req, res)  {
    if(response!= 'undefined'){
      let response =await users.sendGrades(req.body.data);
        res.status(200).send(response);
      
    }
   


})
app.post('/progression',async function(req, res)  {
  console.log("WAZAAAAAA")
  if(response!= 'undefined'){
    let response =await users.setExpectation(req.body.data);
      res.status(200).send(response);
    
  }
 


})


app.post('/teacher/ownedCourse',async function(req, res)  {
  if(response!= 'undefined'){
    let response =await users.ownedCourse(req.body.userId);
     
      res.status(200).send(response);
    
  }



})
app.post('/grades', async function(req, res)  {
  console.log("////////////////" + req.body.courseId)
  if(response!= 'undefined'){
    let response =await users.getGrades(req.body.courseId);
     
      res.status(200).send(response);
    
  }



})
app.post('/teacher/getCourseUsers',async function(req, res)  {
  if(response!= 'undefined'){
    let response =await users.getCourseUsers(req.body.courseName);
      res.status(200).send(response);
    
  }


})
app.post('/all/courses',async function(req, res)  {
  if(response!= 'undefined'){
    let response =await users.getAllCourses();
      res.status(200).send(response);
    
  }


})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})