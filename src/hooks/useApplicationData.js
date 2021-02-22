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
      axios.get('api/days'),
      axios.get('api/appointments'),
      axios.get('api/interviewers'),
    ]).then((resonse) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: resonse[0].data,
        appointments: resonse[1].data,
        interviewers: resonse[2].data,
      });
    });
  }, []);

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  const bookInterview = (id, interview) => {
    // const [dayInfo, spotCount] = getDayId(state, state.day);
    // const dayIndex = Number(dayInfo[0].id) - 1;
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    // const day = {
    //   ...state.days[dayIndex],
    //   spots: spotCount,
    // };

    // const days = {
    //   ...state.days,
    //   [dayIndex]: day,
    // };
    // console.log(days);

    return axios.put(`api/appointments/${id}`, { interview }).then(() => {
      const days = updateSpots(state.day, state.days, appointments); //use in cancel interview too
      dispatch({ type: SET_INTERVIEW, appointments, days });
    });
  };

  const cancelInterview = (id) => {
    // const [dayInfo, spotCount] = getDayId(state, state.day);
    // const dayIndex = Number(dayInfo[0].id) - 1;

    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    // const day = {
    //   ...state.days[dayIndex],
    //   spots: spotCount,
    // };

    // const days = {
    //   ...state.days,
    //   [dayIndex]: day,
    // };

    return axios
      .delete(`api/appointments/${id}`, { data: { appointments } })
      .then(() => {
        const days = updateSpots(state.day, state.days, appointments);
        dispatch({ type: SET_INTERVIEW, appointments, days });
      });
  };

  return { state, bookInterview, cancelInterview, setDay };
};
