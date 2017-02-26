const path = require('path');
const wikipedia = require(path.join(__dirname, '..', '..', 'node', 'wikipedia'));

describe('Wikipedia', function() {

  it('shoule be defined', () => expect(wikipedia).toBeDefined());

  return it('Should scrape starbucks', function() {
    const url = 'http://en.wikipedia.org/wiki/Starbucks';
    return runs(() =>
      wikipedia.scrape(url, function(res){
        console.log(res);
        return expect(res).toBeDefined();
      })
    );
  });
});
