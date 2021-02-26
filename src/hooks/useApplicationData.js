import { useReducer, useEffect } from 'react';
import axios from 'axios';
import { updateSpots } from '../helpers/selectors';

const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';
const REMOVE_INTERVIEW = 'REMOVE_INTERVIEW';

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day };

    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };

    case SET_INTERVIEW:
      return {
        ...state,
        appointments: action.appointments,
        days: action.days,
      };

    case REMOVE_INTERVIEW:
      return {
        ...state,
        appointments: action.appointments,
        days: action.days,
      };

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: [],
  });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((response) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: response[0].data,
        appointments: response[1].data,
        interviewers: response[2].data,
      });
    });
  }, []);

  useEffect(() => {
    const Socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}`);
    Socket.onopen = (event) => {
      Socket.send('Socket Connection Made');
    };
    Socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === 'SET_INTERVIEW' && response.interview) {
        const appointment = {
          ...state.appointments[response.id],
          interview: { ...response.interview },
        };
        const appointments = {
          ...state.appointments,
          [response.id]: appointment,
        };
        const days = updateSpots(state.day, state.days, appointments);
        dispatch({ type: SET_INTERVIEW, appointments, days });
      }
      if (response.type === 'SET_INTERVIEW' && !response.interview) {
        const appointment = {
          ...state.appointments[response.id],
          interview: null,
        };
        const appointments = {
          ...state.appointments,
          [response.id]: appointment,
        };
        const days = updateSpots(state.day, state.days, appointments);
        dispatch({ type: SET_INTERVIEW, appointments, days });
      }
    };
  }, [state]);

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.put(`api/appointments/${id}`, { interview }).then(() => {
      const days = updateSpots(state.day, state.days, appointments);
      dispatch({ type: SET_INTERVIEW, appointments, days });
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
      .then(() => {
        const days = updateSpots(state.day, state.days, appointments);
        dispatch({ type: SET_INTERVIEW, appointments, days });
      });
  };

  return { state, bookInterview, cancelInterview, setDay };
};
