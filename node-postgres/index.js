const express = require('express')
const token_gen = require('./token-gen')
const app = express()
const port = 3001
const { google } = require('googleapis');

// Your Google OAuth credentials
const CLIENT_ID = '841209852531-rr8k1qt95gb4pbqbtu91potebp9j60l3.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:8082/create-google-docs';
const REFRESH_TOKEN = 'YOUR_REFRESH_TOKEN';

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

app.post('/create-google-docs', (req, res) => {
  // Extract the necessary data from the request body
  const { title, content } = req.body;

  // Use the title and content to create the Google Docs page
  // ... your logic to create the Google Docs page ...

  // Send a success response
  res.status(200).json({ message: 'Google Docs page created successfully' });
});
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

app.delete('/user/deleteCourse/:idCourse', (req, res) => {
  users.deleteCourse(req.params.idCourse)
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
app.post('/message/add', async function(req, res)  {
  if(response!= 'undefined'){
    console.log(req.body.data)
    let response =await users.addMessage(req.body.data);
      res.status(200).send(response);
    
  }
 


})
app.get('/messages/:idReceiver/:idSender', async function(req, res)  {
console.log("AJUNG")
  if(response!= 'undefined'){
    let response =await users.getMessages(req.params.idReceiver,req.params.idSender);
      res.status(200).send(response);
    
  }
 


})
app.get('/users', async function(req, res)  {
  console.log("AJUNG")
    if(response!= 'undefined'){
      let response =await users.getAllUsers();
        res.status(200).send(response);
      
    }
   
  
  
  })
app.post('/teacher/addCourse',async function(req, res)  {
  if(response!= 'undefined'){
    let response =await users.addCourse(req.body.data);
      res.status(200).send(response);
    
  }
})
app.post('/teacher/getCourse',async function(req, res)  {
  if(response!= 'undefined'){
    debugger
    let response =await users.getCourse(req.body.data);
      res.status(200).send(response);
    
  }
})
app.post('/teacher/send',async function(req, res)  {
    if(response!= 'undefined'){
      let response =await users.sendGrades(req.body.data);
        res.status(200).send(response);
      
    }
   


})
app.post('/teacher/getGradesType',async function(req, res)  {
  if(response!= 'undefined'){
    let response =await users.getGradesType(req.body.courseId);
      res.status(200).send(response);
    
  }
 


})
// app.post('/progression',async function(req, res)  {
//   console.log("WAZAAAAAA")
//   if(response!= 'undefined'){
//     let response =await users.setExpectation(req.body.data);
//       res.status(200).send(response);
    
//   }
 


// })


app.post('/teacher/ownedCourse',async function(req, res)  {
  if(response!= 'undefined'){
    let response =await users.ownedCourse(req.body.userId);
     
      res.status(200).send(response);
    
  }



})
app.post('/weights', async function(req, res)  {
  if(response!= 'undefined'){
    let response =await users.getWeights(req.body.courseId);
     
      res.status(200).send(response);
    
  }



})
app.post('/teacher/editCourse', async function(req, res)  {
  if(response!= 'undefined'){
    debugger
    let response =await users.editCourse(req.body.data);
     
      res.status(200).send(response);
    
  }



})
app.post('/grades', async function(req, res)  {
  if(response!= 'undefined'){
    let response =await users.getGrades(req.body.courseId,req.body.userId);
     
      res.status(200).send(response);
    
  }



})
app.post('/getProgression', async function(req, res)  {
  console.log("AJUNGEEEEEEEEEEEEEEE")
  if(response!= 'undefined'){
    let response =await users.getProgression(req.body.idUser,req.body.idCourse);
     console.log("Ajunge tata")
      res.status(200).send(response);
    
  }



})
app.post('/teacher/getCourseName',async function(req, res)  {
  if(response!= 'undefined'){
    let response =await users.getCourseName(req.body.id);
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