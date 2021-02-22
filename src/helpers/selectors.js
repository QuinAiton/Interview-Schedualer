export const getAppointmentsForDay = (state, day) => {
  const appointments = [];
  const days = state.days;
  const daysFound = days.filter((appointment) => appointment.name === day);
  if (!daysFound[0]) {
    return appointments;
  }
  const appointmentId = daysFound[0].appointments;
  for (const appointment of appointmentId) {
    appointments.push(state.appointments[appointment]);
  }
  return appointments;
};

export const getInterview = (state, interview) => {
  const interviewerData = {};
  if (!interview) {
    return null;
  }
  interviewerData.student = interview.student;
  const { interviewer } = interview;
  const { interviewers } = state;
  for (const key in interviewers) {
    if (interviewers[key].id === interviewer) {
      interviewerData.interviewer = interviewers[key];
    }
  }
  return interviewerData;
};

export const getInterviewersForDay = (state, day) => {
  const interviewers = [];
  const days = state.days;
  console.log(days, 'interview days');
  const daysFound = days.filter((interviewer) => interviewer.name === day);
  if (!daysFound[0]) {
    return interviewers;
  }
  const interviewerID = daysFound[0].interviewers;
  for (const interviewer of interviewerID) {
    interviewers.push(state.interviewers[interviewer]);
  }
  return interviewers;
};

export const getDayId = (state, day) => {
  const spots = [];
  let spotCount = 0;
  const days = state.days;
  const daysFound = days.filter((appointment) => appointment.name === day);
  spots.push(daysFound[0]);

  const nullSpots = getAppointmentsForDay(state, day);
  for (const key in nullSpots) {
    if (!nullSpots[key].interview) {
      spotCount++;
    }
  }
  spots.push(spotCount);
  return spots;
};
