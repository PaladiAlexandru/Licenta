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
      setCurrentGrade(calculatedGrade);
    }
  }, [grades]);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const generateGoogleDocs = () => {
    const docContent = `
Course name: ${grades[0].name}

Grade   | Examination
------------------------
${grades.map((grade) => `${grade.grade}       | ${grade.grade_type}`).join('\n')}
------------------------
Your current grade is: ${currentGrade}
`;

    const fileMetadata = {
      name: 'Grades Document',
      mimeType: 'application/vnd.google-apps.document',
    };

    const fileContent = new Blob([docContent], { type: 'text/plain' });
    const reader = new FileReader();
    reader.readAsDataURL(fileContent);
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const metadata = {
        name: 'Grades Document',
        mimeType: 'application/vnd.google-apps.document',
      };

      const requestBody = delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: text/plain\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        closeDelimiter;

      fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${YOUR_GOOGLE_ACCESS_TOKEN}`,
          'Content-Type': `multipart/related; boundary="${boundary}"`,
        },
        body: requestBody,
      })
        .then((response) => response.json())
        .then((data) => {
          setGoogleDocsLink(`https://docs.google.com/document/d/${data.id}`);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  };

  const PDFDocument = ({ data, courseName, currentGrade }) => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.courseName}>Course name: {courseName}</Text>
          <Text style={styles.currentGrade}>Current grade: {currentGrade}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCell}>Grade</Text>
            <Text style={styles.tableHeaderCell}>Examination</Text>
          </View>
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.gradeCell}>{item.grade}</Text>
              <Text style={styles.examCell}>{item.grade_type}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

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
    table: {
      display: 'table',
      width: '100%',
      marginTop: 10,
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tableHeaderCell: {
      margin: 5,
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    gradeCell: {
      margin: 5,
      fontSize: 10,
      textAlign: 'center',
      paddingRight: 10,
    },
    examCell: {
      margin: 5,
      fontSize: 10,
      textAlign: 'center',
      paddingLeft: 10,
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
            <PDFDownloadLink document={<PDFDocument data={grades} courseName={grades[0].name} currentGrade={currentGrade} />} fileName="grades.pdf">
              <FontAwesomeIcon icon={faDownload} /> Download PDF
            </PDFDownloadLink>
          </div>
          {googleDocsLink && <a href={googleDocsLink} target="_blank" rel="noopener noreferrer">Open Google Docs</a>}
          <button onClick={generateGoogleDocs}>Generate Google Docs</button>
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
