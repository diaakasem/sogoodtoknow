import request from "request";

export default class Google {

  longlat(place, callback){
    console.log(place);
    const url = `http://maps.googleapis.com/maps/api/geocode/json?address=${place}&sensor=false`;
    console.log(url);
    return request(url, (err, res, body)=> typeof callback === 'function' ? callback(err, res) : undefined);
  }

};
