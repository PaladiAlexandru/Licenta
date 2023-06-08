import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { deleteCourse } from "../services/teacher-service";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { useEffect } from "react";
import { getAllGrades } from "../services/grades";

const CLIENT_ID = "998457321788-8vpld9qphpm5l17dcjhvc1ijau4lsg4a.apps.googleusercontent.com";
const API_KEY = "AIzaSyALm75WAURVXzkvTtrUvyARo9yFz_vdcM0";
const SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets";

const Course = (props) => {
  const { course, onRemove } = props;
  const history = useHistory();
  const [isHovered, setIsHovered] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    function start() {
      gapi.load("auth2", () => {
        const auth2 = gapi.auth2.getAuthInstance();
        if (!auth2) {
          gapi.auth2.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES
          }).then(() => {
            const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
            setIsSignedIn(isSignedIn);
          });
        } else {
          const isSignedIn = auth2.isSignedIn.get();
          setIsSignedIn(isSignedIn);
        }
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const createTableContent = (data) => {
    let content = [
      ["User", "Grade", "Examination"] // Table header
    ];

    data.forEach((row) => {
      const rowData = [row.username || "", row.grade || 0, row.grade_type || ""]; // Handle undefined values
      content.push(rowData);
    });

    return content;
  };

  const createGoogleSheet = async (courseName, tableContent) => {
    try {
      const auth2 = gapi.auth2.getAuthInstance();
      const isSignedIn = auth2.isSignedIn.get();

      if (!isSignedIn) {
        // User is not signed in, prompt them to log in
        await auth2.signIn();
      }

      const authResponse = await gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
      const accessToken = authResponse.access_token;

      // Create a Google Sheet
      const spreadsheet = {
        properties: {
          title: `${courseName} - ${new Date().toLocaleString()}`
        },
        sheets: [
          {
            properties: {
              title: "Grades"
            },
            data: [
             
              {
                startRow: 0,
                startColumn: 0,
                rowData: tableContent.map((row) => ({
                  values: row.map((value) => ({ userEnteredValue: { stringValue: value.toString() } }))
                }))
              }
            ]
          }
        ]
      };

      const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(spreadsheet)
      });

      if (response.ok) {
        const responseData = await response.json();
        const spreadsheetId = responseData.spreadsheetId;
        console.log("Spreadsheet created:", responseData);

        // Access the spreadsheet using the spreadsheetId
        const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

        // Open the spreadsheet in a new tab using the current window's location
        window.open(spreadsheetUrl, "_blank");
      } else {
        console.log("Failed to create spreadsheet:", response.status, response.statusText);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const createFile = async () => {
    try {
      const response = await getAllGrades(course.course_id ? course.course_id : course.id);
      if (Array.isArray(response.data.rows)) {
        const tableContent = createTableContent(response.data.rows);
        await createGoogleSheet(course.name, tableContent); // Pass course.name as the parameter
      } else {
        console.log("Invalid data format:", response);
      }
    } catch (error) {
      console.log("Error fetching grades:", error);
    }
  };

  const handleViewGrades = async()=>{
    debugger
    history.push({
      pathname: "/CourseSituation",
      state: { course: course }
    });
    
  }
  const handleEditCourse = () => {
    // Redirect to /editCourse and pass the course as a prop
    history.push({
      pathname: "/editCourse",
      state: { course: course }
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleRemove = () => {
    deleteCourse(course.course_id ? course.course_id : course.id)
      .then(() => {
        onRemove(course.course_id ? course.course_id : course.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const underlineStyle = isHovered ? { textDecoration: "underline", cursor: "pointer" } : {};

  const handleFileClick = () => {
    if (isSignedIn) {
      createFile();
    } else {
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signIn().then(() => {
        setIsSignedIn(true);
        createFile();
      });
    }
  };

  const handleInsertGrades = ()=>{
    history.push({
      pathname: "/InsertGrades",
      state: { course: course }
    });
  }

  return (
    <p>
      <span
        className={`d-flex p-4 bg-info text-white font-weight-bold rounded`}
        style={{ position: "relative" }}
      >
        <span
          onClick={handleEditCourse}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={underlineStyle}
        >
          {course.name}
        </span>
        <button
        type="button"
        className="btn btn-danger"
        style={{ position: "absolute", right: "3%", fontSize: "14px", padding: "4px 8px" }}
        onClick={handleRemove}
      >
        Remove
      </button>
      <button
        type="button"
        className="btn btn-light"
        style={{ position: "absolute", right: "12%", fontSize: "14px", padding: "4px 8px" }}
        onClick={handleFileClick}
      >
        Export to Google
      </button>
      <button
        type="button"
        className="btn btn-light"
        style={{ position: "absolute", right: "27%", fontSize: "14px", padding: "4px 8px" }}
        onClick={handleViewGrades}
      >
        View Grades
      </button>
      <button
        type="button"
        className="btn btn-light"
        style={{ position: "absolute", right: "39%", fontSize: "14px", padding: "4px 8px" }}
        onClick={handleEditCourse}
      >
        Configuration
      </button>
      <button
        type="button"
        className="btn btn-light"
        style={{ position: "absolute", right: "52%", fontSize: "14px", padding: "4px 8px" }}
        onClick={handleInsertGrades}
      >
        Insert grades
      </button>
      </span>
    </p>
  );
};

export default Course;
