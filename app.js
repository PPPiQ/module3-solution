(function() {
  'use strict';
angular.module ('NarrowItDownApp',[])
.controller  ('NarrowItDownController',NarrowItDownController)
.service ('MenuSearchService',MenuSearchService)
.directive('foundItems',foundItemsDirective)
;

function foundItemsDirective() {
  var ddo = {
   restrict: 'A',
    templateUrl: 'remove.html',

    scope: {
      foundItems: '<',
      onRemove: '&'
    },
    controller: FoundItemsController,
    controllerAs: 'list',
    bindToController: true,
     link: FoundItemsLink
  };
  return ddo;
}
//


function FoundItemsLink(scope,element, attrs, controller){

scope.$watch('list.noItemsFound()', function (newValue,oldValue){
      if (newValue === true){
        diplayWarning();
      } else {
        removeWarning();
      }
});

function diplayWarning () {
    var warningElem = element.find("div.error");
    warningElem.slideDown(1);
}

function removeWarning () {
  var warningElem = element.find("div.error");
  warningElem.slideUp(1);
}
}

function FoundItemsController() {
  var list = this;

list.noItemsFound = function (){

    if ( (list.foundItems !== undefined) && (list.foundItems.length < 1 || list.foundItems == null )) {
          return true;
        };
        return false;
 };
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {
var narowthis = this;
var promise = [];
var searchedString ="";


narowthis.searchItem =  function (){
  promise = [];
  if (narowthis.searchedString != "" && narowthis.searchedString!=undefined){
    promise = MenuSearchService.getMatchedMenuItems(narowthis.searchedString);
    promise.then(function (response){

        narowthis.found = response;
      })
        .catch(function (error){
          console.log("SOME ERROR occurred when requesting data.")
          narowthis.found =[];
      });
  } else {
    narowthis.found = "";
  }

};

narowthis.removeItem = function (itemIndex) {
    MenuSearchService.removeItem(narowthis.found,itemIndex);
};


};

MenuSearchService.$inject = ['$http'];
function MenuSearchService ($http){
 var service = this;

 service.removeItem = function ( Items,itemIndex) {
   Items.splice(itemIndex, 1);
 };

 service.getMatchedMenuItems = function (searchedString) {
   return $http({
    method: "GET",
    url: ("https://davids-restaurant.herokuapp.com/menu_items.json"),
     }).then(function (result) {
    // process result and only keep items that match
    var foundItems = [];
    if (searchedString != "" || searchedString == undefined ) {
    angular.forEach(result.data.menu_items,
      function (value,key,obj) {
        if (obj[key].description.toLowerCase().match(searchedString.toLowerCase())) {
          this.push(obj[key]);
        }
       },foundItems);
     };
    // return processed items

    return foundItems;
    });
 };
}

}());
