const Pool = require('pg').Pool
const pool = new Pool({
  user: 'my_user',
  host: 'localhost',
  database: 'catalog_database',
  password: 'root',
  port: 5432,
});


const addCourse = (data) => {
  return new Promise(async function(resolve, reject) {

    const { name,description,type,final_exam,teacher_id } = data
    let course_id=1;
    console.log(data);
    pool.query('INSERT INTO courses (name, description,type,exam_date) VALUES ($1, $2,$3,$4) ', [name, description,type,final_exam], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new course has been added`)
    })
    await pool.query('SELECT id FROM courses WHERE "name"=$1 ', [name], (error, results) => {
      if (error) {
        reject(error)
      }
     
      pool.query('INSERT INTO courses_users (course_id,user_id) VALUES ($1, $2) ', [results.rows[0].id, teacher_id], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`A new course_users has been added`)
      })
    })
    
     
  })
}
async function getCoursesNames(index) {
  if(index>0){
    
    const response = await pool.query('SELECT * FROM courses INNER JOIN courses_users ON courses.id=courses_users.course_id WHERE courses_users.user_id= $1',[index]);
    return response;
  }
 
      
  }

const getCourseUsers = (courseName) => {
    return new Promise(function(resolve, reject) {
      pool.query("SELECT * FROM users INNER JOIN courses_users ON courses_users.user_id= users.id WHERE courses_users.course_id=(SELECT id FROM courses WHERE name=$1) AND users.role !='profesor'", [courseName], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
  const getAllCourses = () => {
    return new Promise(function(resolve, reject) {
      pool.query("SELECT * FROM courses", (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
  const getUser = (user) => {
    const values = [user.username, user.password]
    return new Promise(function(resolve, reject) {
      pool.query('SELECT * FROM users WHERE "name" = $1 AND "password" = $2 ',values, (error, results) => {
        if (error) {
          console.log(error)
          reject(error)
        }
        resolve(results);
      })
    }) 
  }
  const getUsers = () => {
   
    return new Promise(function(resolve, reject) {
      pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
          console.log(error)
          reject(error)
        }
        resolve(results);
      })
    }) 
  }

  const sendGrades = (data) => {
    return new Promise(function(resolve, reject) {
      data.forEach(user => {
        const { courseId, userId, grade }= user;
        pool.query("INSERT INTO public.notes( id_course, id_user, grade)VALUES ($1, $2, $3)", [ courseId, userId, grade ], (error, results) => {
          if (error) {
            reject(error)
          }
          resolve(`Grades have been added`)
        })
      })
      
      
      });

      
     
  }

  const createUser = (body) => {
    return new Promise(function(resolve, reject) {
      const { name, password } = body
      pool.query('INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *', [name, password], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`A new user has been added`)
      })
    })
  }
  const deleteUser = () => {
    return new Promise(function(resolve, reject) {
      const id = parseInt(request.params.id)
      pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`User deleted with ID: ${id}`)
      })
    })
  }

  const removeCourse = (idUser,idCourse) => {
    return new Promise(function(resolve, reject) {
     
      pool.query("DELETE FROM courses_users WHERE user_id=$1 AND course_id=$2", [idUser,idCourse], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`Relation removed with ID: ${idCourse}`)
      })
    })
  }
  const joinCourse = (idUser,idCourse) => {
    return new Promise(function(resolve, reject) {
     
      pool.query("INSERT INTO public.courses_users(course_id, user_id)VALUES ($1, $2);", [idCourse,idUser], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`Course added with ID: ${idCourse}`)
      })
    })
  }
  const removeProf = (id) => {
    debugger
    return new Promise(function(resolve, reject) {
     
      pool.query(" UPDATE users SET role='user' WHERE id=$1", [id], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`Profesor removed with ID: ${id}`)
      })
    })
  }
  const addProf = (id) => {
    debugger
    return new Promise(function(resolve, reject) {
     
      pool.query(" UPDATE users SET role='profesor' WHERE id=$1", [id], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`Profesor added with ID: ${id}`)
      })
    })
  }
  
  module.exports = {
    createUser,
    getUsers,
    deleteUser,
    getUser,
    removeProf,
    addProf,
    getCoursesNames,
    addCourse,
    getCourseUsers,
    sendGrades,
    getAllCourses,
    removeCourse,
    joinCourse
  }