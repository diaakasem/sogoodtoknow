'use strict';

describe('Filter: humanize', function() {

  // load the filter's module
  beforeEach(module('nodeExecuterApp'));

  // initialize a new instance of the filter before each test
  let humanize = {};
  beforeEach(inject($filter => humanize = $filter('humanize'))
  );

  return it('should return the input prefixed with "humanize filter:"', function() {
    const text = 'angularjs';
    return expect(humanize(text)).toBe((`humanize filter: ${text}`));
  });
});
