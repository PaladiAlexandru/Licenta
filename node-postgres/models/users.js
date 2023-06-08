const res = require('express/lib/response');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'catalog_database',
  password: 'password',
  port: 5432,
});


const addCourse = async (data) => {
  const { name, description, type, final_exam, teacher_id, nr_of_grades, weights } = data;

  // Start a transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert course
    const insertCourseQuery = 'INSERT INTO courses (name, description, type, exam_date, nr_of_grades) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const courseResult = await client.query(insertCourseQuery, [name, description, type, final_exam, nr_of_grades]);
    const courseId = courseResult.rows[0].id;

    // Insert into courses_users
    const insertCoursesUsersQuery = 'INSERT INTO courses_users (course_id, user_id) VALUES ($1, $2)';
    await client.query(insertCoursesUsersQuery, [courseId, teacher_id]);

    // Insert grades
    const insertGradesQuery = 'INSERT INTO grades (grade_type, weight, course_id) VALUES ($1, $2, $3)';
    for (let i = 1; i <= nr_of_grades; i++) {
      debugger
      const gradeType = i == nr_of_grades ? 'Final exam' : `Test${i}`;
      await client.query(insertGradesQuery, [gradeType, weights[i - 1], courseId]);
    }

    // If everything is successful, commit the transaction
    await client.query('COMMIT');

    return 'A new course has been added, a new course_users has been added, and new grades have been added';

  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const editCourse = (data) => {
  
  return new Promise(async function(resolve, reject) {
    const { name, description, type, final_exam, nr_of_grades, weights, courseId } = data;

    // Update the course information
    pool.query(
      'UPDATE courses SET name = $1, description = $2, type = $3, exam_date = $4, nr_of_grades = $5 WHERE id = $6',
      [name, description, type, final_exam, nr_of_grades, courseId],
      (error, results) => {
        if (error) {
          reject(error);
        }
        
        // Update the weights for each grade type (excluding "Final exam")
        const updatePromises = weights.slice(0, -1).map((weight, index) => {
          const gradeType = `Test${index + 1}`;

          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE grades SET weight = $1 WHERE grade_type = $2 AND course_id = $3',
              [weight, gradeType, courseId],
              (error, results) => {
                if (error) {
                  reject(error);
                }
                
                resolve();
              }
            );
          });
        });

        // Update the weight for "Final exam"
        const finalExamWeight = weights[weights.length - 1];
        const finalExamPromise = new Promise((resolve, reject) => {
          pool.query(
            'UPDATE grades SET weight = $1 WHERE grade_type = $2 AND course_id = $3',
            [finalExamWeight, 'Final exam', courseId],
            (error, results) => {
              if (error) {
                reject(error);
              }
              
              resolve();
            }
          );
        });

        // Combine all update promises
        const allUpdatePromises = [...updatePromises, finalExamPromise];

        // Wait for all weight updates to finish
        Promise.all(allUpdatePromises)
          .then(() => resolve('Course has been edited'))
          .catch((error) => reject(error));
      }
    );
  });
};

const getWeights = (courseId) => {
  return new Promise(async function(resolve, reject) {
    pool.query(
      `SELECT grades.weight FROM grades WHERE grades.course_id = $1 
      ORDER BY CASE WHEN grades.grade_type = 'Final exam' THEN 'ZZZ' ELSE grades.grade_type END`,
      [courseId],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
};


const getCourse = (data) => {
  return new Promise(async function(resolve, reject) {
    
    console.log("DATA "+ data.name)
    const { name,description,type,final_exam,teacher_id } = data
    
  
     pool.query('SELECT id FROM courses WHERE "name"=$1 ', [name], (error, results) => {
      if (error) {
        reject(error)
      }
      
     
        resolve(results);
      
    })
    
     
  })
}
const getCourseName = (id) => {
  return new Promise(async function(resolve, reject) {
    
   
    
    
  
     pool.query('SELECT name FROM courses WHERE "id"=$1 ', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      
     debugger
        resolve(results);
      
    })
    
     
  })
}
const getMessages= (idReceiver,idSender) => {
  return new Promise(async function(resolve, reject) {
  
    
      console.log(idReceiver,"aaa",idSender)
     pool.query('SELECT * FROM messages WHERE (receiver_id=$1 AND sender_id=$2) OR (receiver_id=$2 AND sender_id=$1)', [idReceiver,idSender], (error, results) => {
      if (error) {
        reject(error)
      }
      
     
        resolve(results.rows);
      
    })
    
     
  })
}
const getAllUsers= () => {
  return new Promise(async function(resolve, reject) {

    
     pool.query('SELECT name,id FROM users',  (error, results) => {
      if (error) {
        reject(error)
      }
      
     
        resolve(results.rows);
      
    })
    
     
  })
}
const addMessage= (data) => {
  console.log("data",data)
  return new Promise(async function(resolve, reject) {

    const {receiver_id,sender_id,message,timestamp} = data;
     pool.query('INSERT INTO public.messages(receiver_id, message, "timestamp", sender_id) VALUES ($1, $2, $3, $4)',[receiver_id,message,timestamp,sender_id],  (error, results) => {
      if (error) {
        reject(error)
      }
      
     
        resolve(results);
      
    })
    
     
  })
}

async function getCoursesNames(index) {
  if(index>0){
    
    const response = await pool.query('SELECT * FROM courses INNER JOIN courses_users ON courses.id=courses_users.course_id WHERE courses_users.user_id= $1',[index]);
    return response.rows;
  }
 
      
  }
  const ownedCourse = (userId) => {
    console.log(userId)
    return new Promise(function(resolve, reject) {
      pool.query("SELECT * FROM feed WHERE owner=$1 OR id_user=$1", [userId], (error, results) => {
        if (error) {
          reject(error)
        }
        console.log(userId)
        console.log(results.rows)
        
        if (results)
          resolve(results.rows);
        else
        reject(error)
      })
    }) 
  }

const getCourseUsers = (courseName) => {
    return new Promise(function(resolve, reject) {
      pool.query("SELECT * FROM users INNER JOIN courses_users ON courses_users.user_id= users.id WHERE courses_users.course_id=(SELECT id FROM courses WHERE name=$1) AND users.role !='profesor'", [courseName], (error, results) => {
        if (error) {
          reject(error)
        }
        console.log("results: ",results.rows[0])
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
        console.log(results)
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
  const getGradesType = (courseId) => {
    return new Promise(function(resolve, reject) {
     
      pool.query("SELECT * FROM grades g LEFT JOIN notes n ON g.grade_id = n.id_grade WHERE g.course_id = $1 ORDER BY ARRAY_POSITION(ARRAY['Test1', 'Test2', 'Test3','Test4', 'Test5', 'Test6','Test7', 'Test8', 'Test9','Test10', 'Test11', 'Test12', 'Final exam'], grade_type)", [courseId], (error, results) => {
        if (error) {
          reject(error)
        }
        console.log("AMAMAAAAAAAAAAAAAAAAAA ", results, " Courseid ", courseId)
        resolve(results)
      })
      
      
       

        
          
        
      })
      
      

      
     
  }
  const sendGrades = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        for (const user of data) {
          const { courseId, userId, idGrade, owner, grade } = user;
          console.log("gradeId:", idGrade);
  
          // Check if the record already exists
          const checkQuery = "SELECT * FROM public.notes WHERE id_course = $1 AND id_user = $2 AND id_grade = $3";
          const checkResult = await pool.query(checkQuery, [courseId, userId, idGrade]);
  
          if (checkResult.rows.length > 0) {
            // Update the existing grade
            const updateQuery = "UPDATE public.notes SET grade = $1 WHERE id_course = $2 AND id_user = $3 AND id_grade = $4";
            await pool.query(updateQuery, [grade, courseId, userId, idGrade]);
          } else {
            // Insert a new record
            const insertQuery = "INSERT INTO public.notes (id_course, id_user, id_grade, grade) VALUES ($1, $2, $3, $4)";
            await pool.query(insertQuery, [courseId, userId, idGrade, grade]);
  
            // Check if the record already exists in public.feed
            const checkFeedQuery = "SELECT * FROM public.feed WHERE id_course = $1 AND id_user = $2 AND owner = $3";
            const checkFeedResult = await pool.query(checkFeedQuery, [courseId, userId, owner]);
  
            if (checkFeedResult.rows.length === 0) {
              // Insert a new entry into public.feed
              const feedQuery = "INSERT INTO public.feed (id_course, id_user, owner) VALUES ($1, $2, $3)";
              await pool.query(feedQuery, [courseId, userId, owner]);
            }
          }
  
          console.log("userId:", userId);
        }
  
        resolve("Grades have been added to the feed");
      } catch (error) {
        reject(error);
      }
    });
  };
  
  
  
  // const setExpectation = (data) => {
  //   console.log(data.idUser+ "////////////////////////")
  //   return new Promise(function(resolve, reject) {
      
        
  //       pool.query("INSERT INTO public.progress( id_user, expectation,id_course)VALUES ($1, $2, $3)", [ data.idUser, data.expectation, data.idCourse ], (error, results) => {
  //         if (error) {
  //           reject(error)
  //         }
  //         console.log("trec")
  //         resolve(`Grades have been added to the feed`)
  //       })
        
        
     
      
      
  //     });

      
     
  // }

  const createUser = (body) => {
    return new Promise(function(resolve, reject) {
      const { username, password } = body
      console.log(username)
      pool.query('INSERT INTO users (name, password,role) VALUES ($1, $2,$3) RETURNING *', [username, password,"user"], (error, results) => {
        if (error) {
          console.log(error)
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
     console.log("Delete: idUser: ",idUser," idCourse: ",idCourse)
      pool.query("DELETE FROM courses_users WHERE user_id=$1 AND course_id=$2", [idUser,idCourse], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`Relation removed with ID: ${idCourse}`)
      })
    })
  }
  const deleteCourse = (idCourse) => {
    return new Promise(function(resolve, reject) {
      console.log("idCourse: ", idCourse);
      pool.query(
        "DELETE FROM courses_users WHERE course_id=$1",
        [idCourse],
        (error1, results1) => {
          if (error1) {
            reject(error1);
          } else {
            pool.query(
              "DELETE FROM courses WHERE id=$1",
              [idCourse],
              (error2, results2) => {
                if (error2) {
                  reject(error2);
                } else {
                  resolve(`Course and relation removed with ID: ${idCourse}`);
                }
              }
            );
          }
        }
      );
    });
  };
  
  
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
    
    return new Promise(function(resolve, reject) {
     
      pool.query(" UPDATE users SET role='profesor' WHERE id=$1", [id], (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`Profesor added with ID: ${id}`)
      })
    })
  }
  const getGrades = (idCourse,idUser) => {
    console.log("ID USER ", idUser)
    return new Promise(function(resolve, reject) {
      debugger
      const query = `
      SELECT notes.grade, users.name, grades.grade_type, courses.name,grades.weight
      FROM notes
      INNER JOIN users ON notes.id_user = users.id
      INNER JOIN grades ON notes.id_grade = grades.grade_id
      INNER JOIN courses ON notes.id_course = courses.id
      WHERE notes.id_course = $1 AND notes.id_user = $2 and notes.grade IS NOT NULL
      `;
      pool.query(query, [idCourse,idUser], (error, results) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ ", results )
                resolve(results);
      });
    });
  };
  const getAllGrades = (idCourse) => {
    debugger
    console.log("COURSE ID",idCourse)
    return new Promise(function(resolve, reject) {
      debugger
      const query = `
      SELECT 
  notes.grade, 
  users.name as username, 
  grades.grade_type, 
  courses.name,
  grades.weight
FROM 
  notes
INNER JOIN 
  users 
ON 
  notes.id_user = users.id
INNER JOIN 
  grades 
ON 
  notes.id_grade = grades.grade_id
INNER JOIN 
  courses 
ON 
  notes.id_course = courses.id
WHERE 
  notes.id_course = $1
ORDER BY 
  grades.grade_type ASC;

      `;
      pool.query(query, [idCourse], (error, results) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ ", results )
                resolve(results);
      });
    });
  };
  
  const getGrade = (userId,courseId,type) => {
    console.log("id:::" + id)
     return new Promise(function(resolve, reject) {
       pool.query('SELECT * FROM notes INNER JOIN users ON notes.id_user=users.id WHERE notes.id_course= $1', [id],(error, results) => {
         if (error) {
           console.log(error)
           reject(error)
         }
         resolve(results);
       })
     }) 
   }
 const getProgression = (id_user,id_course) => {
  console.log("AJUNG FĂĂĂ")
  return new Promise((resolve, reject) => {
    const query = `
    SELECT courses.nr_of_grades, grades.grade_id, grades.grade_type, courses.id, notes.grade, combined.last_grade_taken
FROM courses
LEFT JOIN grades ON courses.id = grades.course_id
LEFT JOIN notes ON grades.grade_id = notes.id_grade AND notes.id_user = $1
LEFT JOIN (
  SELECT MAX(notes.id_grade) AS last_grade_taken
  FROM notes
  WHERE notes.id_grade IN (
    SELECT grades.grade_id
    FROM grades
    WHERE grades.course_id = $2
  )
) AS combined ON 1=1
WHERE courses.id = $2;

    `;

    pool.query(query, [id_user,id_course], (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
      }

      
      console.log("CACAAAAAAAAAAAAA ", results)
      resolve(results);
    });
  });
};


 
  
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
    joinCourse,
    ownedCourse,
    getGrades,
    getCourse,
    getMessages,
    getAllUsers,
    addMessage,
    getGradesType,
    getProgression,
    getWeights,
    editCourse,
    deleteCourse,
    getCourseName,
    getAllGrades
  
  }