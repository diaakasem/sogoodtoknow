const {Ping} = require('./ping');
const {Say} = require('./say');

const p = new Ping();
const s = new Say();

let lastResult = null;

const callback = function(error, stdout, stderr){
  if (error) {
    if (lastResult) {
      lastResult = false;
      return s.say('Cenergy is offline.');
    }
  } else {
    if (!lastResult) {
      lastResult = true;
      return s.say('Cenergy is online.');
    }
  }
};

setInterval(() => p.pingEam(callback)
, 1000);

