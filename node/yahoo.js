const YQL = require('yql');
const yahoo_app_id = 'vCu4FUjV34HSXktB0RHLPOjtgQPm3vnh0zchQcgX.ow8THogzl3Nta_rAC4-';

export default class Yahoo {

  woeid(place, callback){
    //url = "http://where.yahooapis.com/v1/places.q('#{place}')?format=json&appid=#{yahoo_app_id}"

    //query = "select locations.woe.timezone.woeid from ugeo.geocode where text='#{place}' and appname='#{yahoo_app_id}'"
    const query = `SELECT locations.woe.timezone.woeid FROM ugeo.geocode where text='${place}' and appname='${yahoo_app_id}'`;
    console.log(query);
    const yql = new YQL(query);
    return yql.exec(function(error, response) {
      if (error) {
        console.error(error);
      }
      const ret = response.query.results.result[0].locations.woe.timezone.woeid;
      console.log(ret);
      return (typeof callback === 'function' ? callback(error, ret) : undefined);
    });
  }
};
