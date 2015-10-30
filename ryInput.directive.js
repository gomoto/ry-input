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

      function updateElementWidth(modelValue) {
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
      }

      if (attributes.ngModel) {
        scope.$watch(attributes.ngModel, updateElementWidth);
        //Angular runs right after DOMContentLoaded event, so this link function
        //could run before CSS is applied.
        //In that situation, the first updateElementWidth() gets incorrect computed styles.
        //To fix this, run updateElementWidth() one time right after CSS loads.
        $window.addEventListener('load', function onWindowLoad() {
          $window.removeEventListener('load', onWindowLoad);
          updateElementWidth();
        });
      }
    }
  };
}]);
