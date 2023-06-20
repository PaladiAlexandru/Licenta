import React, { useEffect, useState } from "react";
import UserCourse from "./UserCourse";
import { useSelector } from "react-redux";
import getCourses, {
  getAllCourses,
  removeCourse,
  joinCourse,
  getProgression
} from "../services/teacher-service";
import { Portal } from "@material-ui/core";

const UserCourses = () => {
  const user = useSelector((state) => state.auth.user?.rows);
  const [joinedCourses, setJoinedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [progression, setProgression] = useState({});
  const [loadingProgression, setLoadingProgression] = useState(true);
  const [searchTermAllCourses, setSearchTermAllCourses] = useState('');
  const [searchTermYourCourses, setSearchTermYourCourses] = useState('');

  useEffect(() => {
    const fetchProgressionData = async () => {
      setLoadingProgression(true);
      const promises = joinedCourses.map((course) =>
        getProgression(user[0].id, course.course_id ? course.course_id : course.id)
      );
      const results = await Promise.all(promises);
     
      const progressionData = results.reduce((data, result, index) => {
        const course = joinedCourses[index];
        const courseId = course.course_id ? course.course_id : course.id;
        return {
          ...data,
          [courseId]: result.data.rows
        };
      }, {});
      setProgression(progressionData);
      setLoadingProgression(false);
    };

    if (joinedCourses.length > 0) {
      fetchProgressionData();
    }
  }, [joinedCourses, user]);

  useEffect(() => {
    getAllCourses().then((response1) => {
      getCourses(user[0].id).then((response) => {
        setJoinedCourses(response.data);
        const filteredCourses = response1.data.filter((course1) => {
          return !response.data.some((course) => {
            const courseId1 = course1.course_id ? course1.course_id : course1.id;
            const courseId2 = course.course_id ? course.course_id : course.id;
            return courseId1 === courseId2;
          });
        });
        setAllCourses(filteredCourses);
      });
    });
  }, [user]);
  
  const handleJoinBtn = (e) => {
    const courseId = parseInt(e.currentTarget.id);
    joinCourse(user[0].id, courseId)
      .then(() => {
        setJoinedCourses((prevState) => {
          const courseToAdd = allCourses.find(
            (course) => (course.course_id ? course.course_id : course.id) === courseId
          );
            
          if (courseToAdd) {
            setAllCourses((prevState) => prevState.filter((course) => (course.course_id ? course.course_id : course.id) !== courseId));
            return [...prevState, courseToAdd];
          }
  
          return prevState;
        });
      })
      .catch((error) => {
        // Handle error if necessary
      });
  };
  
  const handleLeaveBtn = (e) => {
    const courseId = parseInt(e.currentTarget.id);

    removeCourse(user[0].id, courseId)
      .then(() => {
        setJoinedCourses((prevState) =>
          prevState.filter((course) => (course.course_id ? course.course_id : course.id) !== courseId)
        );

        const courseToAdd = joinedCourses.find(
          (course) => (course.course_id ? course.course_id : course.id) === courseId
        );

        if (courseToAdd) {
          setAllCourses((prevState) => [...prevState, courseToAdd]);
        }
      })
      .catch((error) => {
        // Handle error if necessary
      });
  };

  const handleSearchAllCourses = (event) => {
    setSearchTermAllCourses(event.target.value);
  };

  const handleSearchYourCourses = (event) => {
    setSearchTermYourCourses(event.target.value);
  };

  const filteredAllCourses = allCourses.filter(course => {
    return course.name.toLowerCase().includes(searchTermAllCourses.toLowerCase());
  });

  const filteredYourCourses = joinedCourses.filter(course => {
    return course.name.toLowerCase().includes(searchTermYourCourses.toLowerCase());
  });

  return (
    <div className="container">
      <header className="jumbotron">
        {joinedCourses.length ? (
          <>
            <h3>Your courses</h3>
            <div className="search-bar">
              <label htmlFor="searchInputYourCourses" className="search-label">Search your courses:</label>
              <input id="searchInputYourCourses" type="text" placeholder="Enter a course name" value={searchTermYourCourses} onChange={handleSearchYourCourses} className="search-input" />
            </div>
            {filteredYourCourses.map((course, id) => (
              <UserCourse
                courseName={`${course.name}`}
                key={id}
                owned={true}
                handleOnClick={(e) => handleLeaveBtn(e)}
                id={course.course_id ? course.course_id : course.id}
                progression={loadingProgression ? null : progression[course.course_id ? course.course_id : course.id]}
              />
            ))}
          </>
        ) : null}

        {allCourses.length > 0 && (
          <div>
            <h3>All courses</h3>
            <div className="search-bar">
              <label htmlFor="searchInputAllCourses" className="search-label">Search all courses:</label>
              <input id="searchInputAllCourses" type="text" placeholder="Enter a course name" value={searchTermAllCourses} onChange={handleSearchAllCourses} className="search-input" />
            </div>
            {filteredAllCourses.map((course, id) => (
              <UserCourse
                courseName={`${course.name}`}
                key={id}
                owned={false}
                handleOnClick={handleJoinBtn}
                id={course.course_id ? course.course_id : course.id}
                progression={loadingProgression ? null : progression[course.course_id ? course.course_id : course.id]}
              />
            ))}
          </div>
        )}
      </header>
    </div>
  );
};

export default UserCourses;
