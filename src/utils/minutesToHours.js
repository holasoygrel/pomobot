const moment = require("moment");

module.exports = {
  formatDuration: (totalMinutes) => {
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    let hourSingularOrPlural = hours === 1 ? "hora" : "horas";

    return hours === 0
      ? `${minutes} minutos`
      : `${hours} ${hourSingularOrPlural} ${minutes} minutos`;
  },
};
