var app = angular.module("MIPS",['BinFilter','HexFilter','MemFilter', "ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        // route for auc home page

        .when('/', {
              templateUrl : 'views/editor.html',
              controller  : 'CPUController'
         })

        .when('/editor', {
              templateUrl : 'views/editor.html',
              controller  : 'CPUController'
        })

        .when('/memory', {
            templateUrl : 'views/memory.html',
            controller  : 'CPUController'
        })

        .when('/cpu', {
            templateUrl : 'views/buffers.html',
            controller  : 'CPUController'
        })
});

angular.module('BinFilter', []).filter('BinFilter', function() {
  return function(input) {
    return pad(Dec2Bin(input),16);
  };
});

angular.module('HexFilter', []).filter('HexFilter', function() {
  return function(input) {
    return "0x"+pad(Dec2Hex(input),4);
  };
});

angular.module('MemFilter', []).filter('MemFilter', function() {
  return function(input) {
    return "0x"+pad(Dec2Hex(input),2);
  };
});

//Decimal operations
function Dec2Bin(n){
  if(n<0) return (n>>>0).toString(2);
  if(!checkDec(n)) return 0;
  return n.toString(2)
}
function Dec2Hex(n){
  if(n<0) return (n>>>0).toString(16);
  if(!checkDec(n)) return 0;
  return n.toString(16)
}

function pad(s,z){s=""+s;return s.length<z?pad("0"+s,z):s}
function checkDec(n){return/^[0-9]{1,64}$/.test(n)}

function changeTheme(value){
  var editor = ace.edit("assemblyCode");
  switch (parseInt(value)) {
    case 0: editor.setTheme("ace/theme/ambiance"); selectedTheme = "ambiance"; break;
    case 1: editor.setTheme("ace/theme/chrome"); selectedTheme = "chrome"; break;
    case 2: editor.setTheme("ace/theme/clouds_midnight"); selectedTheme = "clouds_midnight"; break;
    case 3: editor.setTheme("ace/theme/github"); selectedTheme = "github";break;
    case 4: editor.setTheme("ace/theme/twilight"); selectedTheme = "twilight";break;
    case 5: editor.setTheme("ace/theme/pastel_on_dark"); selectedTheme = "pastel_on_dark";break;
    case 6: editor.setTheme("ace/theme/xcode"); selectedTheme = "xcode";break;
    default: break;
  }
}