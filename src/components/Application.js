import React, { useState, useEffect } from 'react';
import 'components/Application.scss';
import axios from 'axios';
import { DayList } from './DayList';
import { Appointment } from './Appointments/Index';
import { getAppointmentsForDay } from '../helpers/selectors';
import { getInterview } from '../helpers/selectors';
import { getInterviewersForDay } from '../helpers/selectors';

export default function Application(props) {
  // State
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: [],
  });

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

      // const [daysApi, appointmentsApi, interviewersApi] = all;
    });
  }, []);

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.put(`api/appointments/${id}`, { interview }).then((data) => {
      setState({ ...state, appointments });
    });
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .delete(`api/appointments/${id}`, { data: { appointments } })
      .then((data) => {
        console.log(data);
        setState({ ...state, appointments });
      });
  };

  const setDay = (day) => setState((cur) => ({ ...cur, day }));

  const interviewersForDay = getInterviewersForDay(state, state.day);
  const appointments = getAppointmentsForDay(state, state.day);

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        interviewers={interviewersForDay}
        interviewer={interview}
        {...appointment}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
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
        {schedule}, <Appointment key='last' time='5pm' />
      </section>
    </main>
  );
}
