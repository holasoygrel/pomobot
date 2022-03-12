let parseInteractionOptions = (options) => {
  let parsed = { work: null, rest: null, error: { pom: "", rest: "" } };

  options.forEach((option) => {
    if (option.name === "break") {
      parsed.rest = option.value;
    } else {
      parsed[option.name] = option.value;
    }
  });

  if (parsed.work !== null && (parsed.work < 10 || parsed.work > 120)) {
    parsed.work = 25;
    parsed.error.pom =
      "\n```Error: Tiempo de trabajo introducido no esta dentro de los limites, se ha establecido por defecto a 25 minutos```";
  }

  if (
    parsed.rest !== null &&
    parsed.rest !== 0 &&
    (parsed.rest > 30 || parsed.rest < 5)
  ) {
    parsed.rest = 5;
    parsed.error.rest =
      "\n```Error: Tiempo de descanso no esta dentro de los limites, el limite por defecto del tiempo de descanso se ha establecido en 5 minutos```";
  }

  if (parsed.work === null) {
    parsed["work"] = 25;
  }

  return parsed;
};

let parseMessageOptions = (work, rest) => {
  let parsed = { work: work, rest: rest, error: { pom: "", rest: "" } };

  if (parsed.work !== null && (parsed.work < 10 || parsed.work > 120)) {
    parsed.work = 25;
    parsed.error.pom =
      "\n```Error: Tiempo de trabajo introducido no esta dentro de los limites, se ha establecido por defecto a 25 minutos```";
  }

  if (
    parsed.rest !== null &&
    parsed.rest !== 0 &&
    (parsed.rest > 30 || parsed.rest < 5)
  ) {
    parsed.rest = 5;
    parsed.error.rest =
      "\n```Error: Tiempo de descanso no esta dentro de los limites, el limite por defecto del tiempo de descanso se ha establecido en 5 minutos```";
  }

  if (parsed.work === null) {
    parsed["work"] = 25;
  }

  return parsed;
};

module.exports = {
  parseInteractionOptions,
  parseMessageOptions,
};
