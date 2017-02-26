'use strict';

describe('Directive: tabnav', function() {

  // load the directive's module
  beforeEach(module('nodeExecuterApp'));

  let scope = {};

  beforeEach(inject(($controller, $rootScope) => scope = $rootScope.$new())
  );

  return it('should make hidden element visible', inject(function($compile) {
    let element = angular.element('<tabnav></tabnav>');
    element = $compile(element)(scope);
    return expect(element.text()).toBe('this is the tabnav directive');
  })
  );
});
