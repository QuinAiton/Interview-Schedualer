import React, { useState } from 'react';
import { Button } from 'components/Button';
import { InterviewerList } from 'components/InterviewerList';

export const Form = (props) => {
  const [name, setName] = useState(props.name || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  // const reset = () => {
  //   setName('');
  //   setInterviewer(null);
  // };

  // const cancel = (props) => {
  //   reset();
  // };
  return (
    <main className='appointment__card appointment__card--create'>
      <section className='appointment__card-left'>
        <form autoComplete='off'>
          <input
            onSubmit={(event) => event.preventDefault()}
            className='appointment__create-input text--semi-bold'
            name='name'
            type='text'
            value={name}
            placeholder='Enter Student Name'
            onChange={(event) => setName(event.target.value)}
          />
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          interviewer={interviewer}
          setInterviewer={setInterviewer}
        />
      </section>
      <section className='appointment__card-right'>
        <section className='appointment__actions'>
          <Button onClick={props.onCancel} danger>
            Cancel
          </Button>
          <Button onClick={props.onSave} confirm>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
};
