import React, { useState, useEffect } from 'react';
import 'components/Application.scss';
import axios from 'axios';
import { DayList } from './DayList';
import { Appointment } from './Appointments/Index';
import { getAppointmentsForDay } from '../helpers/selectors';

const appointments = [
  {
    id: 1,
    time: '9am',
  },
  {
    id: 2,
    time: '1pm',
    interview: {
      student: 'Lydia Miller-Jones',
      interviewer: {
        id: 1,
        name: 'Sylvia Palmer',
        avatar: 'https://i.imgur.com/LpaY82x.png',
      },
    },
  },
  {
    id: 3,
    time: '2pm',
  },
  {
    id: 4,
    time: '3pm',
    interview: {
      student: 'Quinten Aiton',
      interviewer: {
        id: 2,
        name: 'Tori Malcolm',
        avatar: 'https://i.imgur.com/Nmx0Qxo.png',
      },
    },
  },
  {
    id: 5,
    time: '4pm',
    interview: {
      student: 'Rob Morris',
      interviewer: {
        id: 5,
        name: 'Sven Jones',
        avatar: 'https://i.imgur.com/twYrpay.jpg',
      },
    },
  },
];

export default function Application(props) {
  // State
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const setDay = (day) => setState((cur) => ({ ...cur, day }));

  //API Managment
  useEffect(() => {
    Promise.all([
      axios.get('api/days'),
      axios.get('api/appointments'),
      axios.get('api/interviewers'),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));

      const [first, second, third] = all;
    });
  }, []);

  const Appointements = dailyAppointments.map((appointment) => {
    return <Appointment key={appointment.id} {...appointment} />;
  });

  return (
    <main className='layout'>
      <section className='sidebar'>
        <img
          className='sidebar--centered'
          src='images/logo.png'
          alt='Interview Scheduler'
        />
        <hr className='sidebar__separator sidebar--centered' />
        <nav className='sidebar__menu'>
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className='sidebar__lhl sidebar--centered'
          src='images/lhl.png'
          alt='Lighthouse Labs'
        />
      </section>
      <section className='schedule'>
        {Appointements}, <Appointment key='last' time='5pm' />
      </section>
    </main>
  );
}
