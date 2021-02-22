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
  const EMPTY = 'EMPTY',
    SHOW = 'SHOW',
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    SAVING = 'SAVING',
    DELETE = 'DELETE',
    CONFIRM = 'CONFIRM',
    ERROR_SAVE = 'ERROR_SAVE',
    ERROR_DELETE = 'ERROR_DELETE',
    ERROR_EMPTY = 'ERROR_EMPTY';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    if (!name || !interviewer) {
      transition(ERROR_EMPTY);
      return;
    }
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
      .catch(() => {
        transition(ERROR_SAVE, true);
      });
  };

  const onDelete = (id) => {
    transition(DELETE, true);
    props
      .cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(() => {
        transition(ERROR_DELETE, true);
      });
  };
  return (
    <article className='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message='Saving Interview' />}
      {mode === DELETE && <Status message='Deleting Interview' />}
      {mode === ERROR_SAVE && (
        <Error message='Could Not Create Appointment' onClose={() => back()} />
      )}
      {mode === ERROR_DELETE && (
        <Error message='Count Not Delete Appointment' onClose={() => back()} />
      )}
      {mode === ERROR_EMPTY && (
        <Error
          message='Please Fill Out All The Feilds'
          onClose={() => back()}
        />
      )}
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
          interviewer={props.interviewer}
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
