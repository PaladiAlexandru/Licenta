import React, { useEffect, useState } from 'react';
import store from '../../store';
import Table from 'react-bootstrap/Table';
import { getGrades } from '../../services/grades';
import { useSelector } from 'react-redux';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const GradesUsers = () => {
  const [grades, setGrades] = useState([]);
  const [currentGrade, setCurrentGrade] = useState(0);
  const courseId = useSelector((state) => state.courseId.id); // Extract the courseId value from the state

  useEffect(() => {
    if (courseId && store.getState().auth.user?.rows[0]?.id) { // Add null check for courseId and user ID
      getGrades(courseId, store.getState().auth.user.rows[0].id) // Pass courseId and user ID to getGrades function
        .then((response) => {
          setGrades(response.data.rows);
        })
        .catch((error) => {
          console.log(error);
          // Handle the error here
        });
    }
  }, [courseId]);

  useEffect(() => {
    if (grades.length > 0) {
      const calculatedGrade = grades
        .map((grade) => grade.weight * 0.1 * grade.grade)
        .reduce((total, value) => total + value, 0);
      setCurrentGrade(calculatedGrade);
    }
  }, [grades]);

  const PDFDocument = ({ data, courseName }) => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.courseName}>Course name: {courseName}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCell}>Grade</Text>
            <Text style={styles.tableHeaderCell}>Type</Text>
          </View>
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.grade}</Text>
              <Text style={styles.tableCell}>{item.grade_type}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  const styles = StyleSheet.create({
    // Stylesheet styles here
  });

  return (
    <div className='container'>
      {grades.length > 0 && (
        <>
          <h3>Course name: {grades[0].name}</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Grade</th>
                <th>Type</th>
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
          <div className='download-icon'>
            <PDFDownloadLink document={<PDFDocument data={grades} courseName={grades[0].name} />} fileName='grades.pdf'>
              <FontAwesomeIcon icon={faDownload} /> Download PDF
            </PDFDownloadLink>
          </div>
        </>
      )}
    </div>
  );
};

export default GradesUsers;
