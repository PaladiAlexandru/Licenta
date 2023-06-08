import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from "react";
import { getAllGrades } from "../services/grades";
import React from "react";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import {  Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { useLocation } from "react-router-dom";
const GradesTeacher = (props) => {

    debugger
    const PDFDocument = ({ data, courseName, currentGrade }) => {
        const currentDate = new Date().toLocaleString();

        return (
          <Document>
            <Page style={styles.page}>
              <View style={styles.header}>
              <Text style={styles.currentDate}>Date: {currentDate}</Text>
                <Text style={styles.courseName}>Course name: {courseName}</Text>
                
                
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeaderCell}>Grade</Text>
                  <Text style={styles.tableHeaderCell}>Examination</Text>
                  <Text style={styles.tableHeaderCell}>Name</Text>
                </View>
                {data.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.gradeCell}>{item.grade}</Text>
                    <Text style={styles.examCell}>{item.grade_type}</Text>
                    <Text style={styles.examCell}>{item.username}</Text>
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
      
      const location = useLocation();
      const course = location.state?.course;
    const [grades,setGrades] = useState([])
    useEffect(()=>{
        getAllGrades(course.course_id ? course.course_id : course.id).then(response =>{
            debugger
            setGrades(response.data.rows)
        })
    },[])

return (
    <div className="container">
      {grades.length > 0 ? (
        <>
          <h3>Course name: {grades[0].name}</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Examination</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, id) => (
                <tr key={id}>
                    <td>{grade.username}</td>
                  <td>{grade.grade}</td>
                  <td>{grade.grade_type}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <div className="download-icon">
          <PDFDownloadLink document={<PDFDocument data={grades} courseName={grades[0].name} />} fileName={`${grades[0].name}.pdf`}>
              <FontAwesomeIcon icon={faDownload} /> Download PDF
            </PDFDownloadLink>
          </div>
        </>
      ) : (
        <>
          
          <div className="no-grades-message">
            <h4>There are no grades inserted yet!</h4>
          </div>
        </>
      )}
    </div>
  );
};

export default GradesTeacher;