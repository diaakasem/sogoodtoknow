// import sys from 'sys';
import { exec } from 'child_process';

export default class Executer {
  constructor() {
    this.callbacks = {};
  }

  notify(name){
    let callbacks;
    if (name) {
      callbacks = this.callbacks[name];
    } else {
      console.log("No name provided");
    }

    return (error, stdout, stderr)=> {
      this.puts(error, stdout, stderr);
      return callbacks.map((callback) =>
        callback(error, stdout, stderr));
    };
  }

  addCallback(name, callback){
    if (this.callbacks[name] == null) { this.callbacks[name] = []; }
    if (callback) {
      return this.callbacks[name].push(callback);
    } else {
      return console.log(`No callback for ${name}`);
    }
  }

  execute(cmd, callback){
    this.addCallback(cmd.name, callback);
    return exec(cmd.command, this.notify(cmd.name));
  }

  puts(error, stdout, stderr){
    if (error) {
      // return sys.puts(stderr);
      return console.error(stderr);
    } else {
      return console.info(stdout);
    }
  }
}
