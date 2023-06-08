import React, { useEffect, useState } from 'react';
import store from '../../store';
import Table from 'react-bootstrap/Table';
import { getGrades } from '../../services/grades';
import { useSelector } from 'react-redux';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import './GradesUsers.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { getCourseName } from '../../services/teacher-service';

const GradesUsers = () => {
  const [grades, setGrades] = useState([]);
  const [currentGrade, setCurrentGrade] = useState(0);
  const courseId = useSelector((state) => state.courseId.id); // Extract the courseId value from the state
  const [localCourseName, setLocalCourseName] = useState('');
  const [googleDocsLink, setGoogleDocsLink] = useState('');

  useEffect(() => {
    if (courseId && store.getState().auth.user?.rows[0]?.id) {
      getGrades(courseId, store.getState().auth.user.rows[0].id)
        .then((response) => {
          debugger;
          setGrades(response.data.rows);
        })
        .catch((error) => {
          console.log(error);
        });

      getCourseName(courseId).then((response) => {
        setLocalCourseName(response.data.rows[0].name);
      });
    }
  }, [courseId]);

  useEffect(() => {
    if (grades.length > 0) {
      const calculatedGrade = grades.reduce((total, grade) => total + grade.weight * 0.01 * grade.grade, 0);
      const formattedGrade = calculatedGrade.toFixed(2); // Limit to two decimal places
      setCurrentGrade(formattedGrade);
    }
  }, [grades]);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const PDFDocument = ({ data, courseName, currentGrade }) => {
    const currentDate = new Date().toLocaleString();
  
    return (
      <Document>
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.currentDate}>Date: {currentDate}</Text>
            <Text style={styles.courseName}>Course name: {courseName}</Text>
            <Text style={styles.currentGrade}>Current grade: {currentGrade}</Text>
          </View>
          <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCell}>Grade</Text>
            <Text style={styles.tableDivider} />
            <Text style={styles.tableHeaderCell}>Examination</Text>
          </View>
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.gradeCell}>{item.grade}</Text>
              <Text style={styles.tableDivider} />
              <Text style={styles.examCell}>{item.grade_type}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
    );
  };

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      paddingTop: 30,
      paddingBottom: 60,
      paddingHorizontal: 30,
    },
    header: {
      marginBottom: 20,
    },
    courseName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    currentGrade: {
      fontSize: 16,
      marginBottom: 10,
    },
    currentDate: {
      fontSize: 14,
      position: 'absolute',
      top: 30,
      right: 30,
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      paddingBottom: 5,
    },
    tableDivider: {
      flex: 0,
      height: '100%',
      borderLeftColor: '#000',
      marginLeft: 5,
      marginRight: 5,
    },
    table: {
      display: 'table',
      width: '100%',
      marginTop: 10,
    },
   
    tableHeaderCell: {
      flex: 1,
      margin: 5,
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    gradeCell: {
      flex: 1,
      margin: 5,
      fontSize: 10,
      textAlign: 'center',
    },
    examCell: {
      flex: 1,
      margin: 5,
      fontSize: 10,
      textAlign: 'center',
    },
  });
  

  return (
    <div className="container">
      {grades.length > 0 ? (
        <>
          <h3>Course name: {grades[0].name}</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Grade</th>
                <th>Examination</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, id) => (
                <tr key={id}>
                  <td>{grade.grade}</td>
                  <td>{grade.grade_type}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h3>Your current grade is: {currentGrade}</h3>
          <div className="download-icon">
          <PDFDownloadLink document={<PDFDocument data={grades} courseName={grades[0].name} currentGrade={currentGrade} />} fileName={`${grades[0].name}.pdf`}>
              <FontAwesomeIcon icon={faDownload} /> Download PDF
            </PDFDownloadLink>
          </div>
        </>
      ) : (
        <>
          <h3 className="course-name">Course name: {localCourseName}</h3>
          <div className="no-grades-message">
            <h4>There are no grades inserted yet!</h4>
          </div>
        </>
      )}
    </div>
  );
};

export default GradesUsers;
