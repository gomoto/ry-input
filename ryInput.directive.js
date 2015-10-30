angular.module('ryInputDemo')
.directive('ryInput', ['$window', function($window) {

  //Set up element guide
  var elementGuide = angular.element('<span></span>');
  elementGuide.css({
    display: 'inline-block',
    position: 'fixed',
    left: '0',
    top: '0', //-10000px'
    width: 'auto',
    whiteSpace: 'pre' //preserve white space
  });

  return {
    restrict: 'A',
    link: function postLink(scope, element, attributes) {
      //Don't trim trailing whitespace on input value
      attributes.$set('ngTrim', 'false');

      //Insert element guide after element
      //but it doesn't matter where guide is (position: fixed)
      element.after(elementGuide);
      if (attributes.ngModel) {
        scope.$watch(attributes.ngModel, function(modelValue) {
          //input text --> guide text
          elementGuide.html(modelValue);
          //input text style --> guide text style
          var elementComputedStyle = $window.getComputedStyle(element[0]);
          angular.forEach([
            'border-left-style',
            'border-left-width',
            'border-right-style',
            'border-right-width',
            'font-family',
            'font-kerning',
            'font-size',
            'font-stretch',
            'font-style',
            'font-variant',
            'font-variant-ligatures',
            'font-weight',
            'letter-spacing',
            'max-width',
            'min-width',
            'padding-left',
            'padding-right',
            'text-indent',
            'text-transform',
            'word-spacing'
          ], function(property) {
            elementGuide.css(property, elementComputedStyle[property]);
          });
          //guide width --> input width
          var elementGuideWidth = $window.getComputedStyle(elementGuide[0]).width;
          element.css('width', elementGuideWidth);
        });
      }
    }
  };
}]);
