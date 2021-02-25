import React from 'react';
import { InterviewerListItem } from 'components/InterviewerListItem';
import propTypes from 'prop-types';

export const InterviewerList = (props) => {
  // InterviewerList.propTypes = {
  //   interviewer: propTypes.array.isRequired,
  // };
  const interviewers = props.interviewers.map((interviewer) => {
    return (
      <InterviewerListItem
        key={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={props.interviewer === interviewer.id}
        setInterviewer={(event) => props.setInterviewer(interviewer.id)}
      />
    );
  });

  return (
    <section className='interviewers'>
      <h4 className='interviewers__header text--light'>Interviewer</h4>
      <ul className='interviewers__list'>{interviewers}</ul>
    </section>
  );
};
