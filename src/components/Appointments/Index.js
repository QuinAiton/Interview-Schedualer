import React from 'react';
import 'components/Appointments/styles.scss';
import { Header } from 'components/Appointments/Header';
import { Show } from 'components/Appointments/Show';
import { Empty } from 'components/Appointments/Empty';
import { Form } from 'components/Appointments/Form';
import { useVisualMode } from '../../hooks/useVisualMode';
import { Status } from 'components/Appointments/Status';
import { Confirm } from 'components/Appointments/Confirm';
import { Error } from 'components/Appointments/Error';

export const Appointment = (props) => {
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const EDIT = 'EDIT';
  const SAVING = 'SAVING';
  const DELETE = 'DELETE';
  const CONFIRM = 'CONFIRM';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer,
    };

    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDelete = (id) => {
    transition(DELETE);
    props
      .cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <article className='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message='Saving Interview' />}
      {mode === DELETE && <Status message='Deleting Interview' />}
      {mode === CONFIRM && (
        <Confirm onConfirm={onDelete} onCancel={() => back()} />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interviewer.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interviewer}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      )}
    </article>
  );
};
