import Executer from './executer.js';

export default class Ping extends Executer {

  ping(website, callback){
    const cmd = {
      name: 'ping',
      command: `ping -c 3 ${website}`
    };
    return this.execute(cmd, callback);
  }

  pingGoogle(callback){
    return this.ping('google.com', callback);
  }

  pingEam(callback){
    return this.ping('eam.im:8083', callback);
  }
};
