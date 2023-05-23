import React from 'react';
import './ProgressBar.css'; // assuming you have a css file for styling

const ProgressBar = ({ currentStep, numberOfGrades, testsTaken }) => {
  const circles = [];

  for (let i = 0; i < numberOfGrades; i++) {
    const isCompleted = currentStep >= i + 1;
    let circleTitle;

    if (i < testsTaken.length) {
      circleTitle = `${testsTaken[i]} took place`;
    } else {
      const lastTestNumber = testsTaken.length + i - testsTaken.length + 1;
      if (i === numberOfGrades - 1) {
        circleTitle = "Final exam didn't take place";
      } else {
        circleTitle = `Test ${lastTestNumber} didn't take place`;
      }
    }

    circles.push(
      <React.Fragment key={`circle-${i}`}>
        <div className={`circle ${isCompleted ? 'completed' : ''}`} title={circleTitle}>
          <span>&#10003;</span>
        </div>
        {i !== numberOfGrades - 1 && <div className={`line ${isCompleted ? 'completed' : ''}`}></div>}
      </React.Fragment>
    );
  }

  return <div className="progressBar">{circles}</div>;
};

export default ProgressBar;
