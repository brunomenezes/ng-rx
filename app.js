'use strict';
var module = angular.module('MyApp', []);
module.controller('MyCtrl', MyCtrl);
MyCtrl.$inject = [];
function MyCtrl(){
  var vm = this;
  vm.boxes = [{title:'hello'}];

  vm.createBox = function(title){
    vm.boxes.push({title:title});
  };
}

module.directive('draggable', Draggable);
Draggable.$inject = [];

function Draggable(){
  const fromEvent = Rx.Observable.fromEvent;
  const mousemove$ = fromEvent(document, 'mousemove');
  return {
    restrict:'A',
    link:linkFn
  };

  function linkFn(scope, element, attr){
    const mouseenter$ = fromEvent(element, 'mouseenter');
    const mouseleave$ = fromEvent(element, 'mouseleave');
    const mousedown$ = fromEvent(element, 'mousedown');
    const mouseup$ = fromEvent(element, 'mouseup');
    const dblclick$ = fromEvent(element, 'dblclick');
    const originalPlace = element[0].getBoundingClientRect();
    console.log(originalPlace)
    dblclick$.subscribe(() => {
      element.removeClass('mousedown');
      moveTo({top:originalPlace.top, left:originalPlace.left});
    });

    const dragging = mousedown$.flatMap(function(md) {
      element.addClass('mousedown');
      var startX = md.offsetX, startY = md.offsetY;
      return mousemove$.map(function(mm){
        mm.preventDefault();
        return {top:mm.clientY - startY,left:mm.clientX - startX};
      }).takeUntil(mouseup$);
    });

    dragging.forEach(moveTo);

    mouseenter$.subscribe(function(el) {
        element.addClass('mouseenter');
    });

    mouseleave$.subscribe(function(el){
      element.removeClass('mouseenter');
    });

    function moveTo (pos){
      console.log(pos);
      element.css({'top':(pos.top+'px'), 'left':(pos.left+'px')});
    }
  }
}
