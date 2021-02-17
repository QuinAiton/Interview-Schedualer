import React, { Fragment } from 'react';
import 'components/Appointments/styles.scss';
import { Header } from 'components/Appointments/Header';
import { Show } from 'components/Appointments/Show';
import { Empty } from 'components/Appointments/Empty';
export const Appointment = (props) => {
  return (
    <article className='appointment'>
      <Header time={props.time}></Header>
      {props.interview ? (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
        />
      ) : (
        <Empty />
      )}
    </article>
  );
};
