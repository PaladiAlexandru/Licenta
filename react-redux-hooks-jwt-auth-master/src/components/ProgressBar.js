import React from 'react';
import './ProgressBar.css'; // assuming you have a CSS file for styling

const ProgressBar = ({ currentStep, numberOfGrades, progression }) => {
  const circles = [];

  for (let i = 0; i < numberOfGrades; i++) {
    let isCompleted;
    let isMissed;
    let circleTitle;

    if (progression[i].grade !== null) {
      circleTitle = `${progression[i].grade_type} took place`;
      isCompleted = true;
      isMissed = false;
    } else {
      if (progression[i].last_grade_taken >= progression[i].grade_id) {
        circleTitle = `You missed ${progression[i].grade_type}!`;
        isCompleted = false;
        isMissed = true;
      } else {
        circleTitle = `${progression[i].grade_type} didn't took place`;
        isCompleted = false;
        isMissed = false;
      }
    }

    const circleContent = isCompleted ? '✓' : (isMissed ? '✘' : '✓');
    // if(progression[0].id == 79)
      debugger
    circles.push(
      <React.Fragment key={`circle-${progression[i].grade_id}`}>
        <div className={`circle ${isCompleted ? 'completed' : ''} ${isMissed ? 'missed' : ''}`} title={circleTitle}>
          <span>{circleContent}</span>
        </div>
        {i !== numberOfGrades - 1 && <div className={`line ${isCompleted ? 'completed' : ''}`}></div>}
      </React.Fragment>
    );
  }

  return <div className="progressBar">{circles}</div>;
};

export default ProgressBar;
