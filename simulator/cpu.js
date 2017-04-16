app.controller('CPUController', ['$scope', '$window', function($scope,$window) {

    
    $scope.regs = new Array(32);
    $scope.memory = new Uint8Array(1024);

    $scope.error = '';
    $scope.memDisplaySize = 255;
    $scope.continue = "Run"
    $scope.showAllRegs = false;

    // Init Editor
    var editor = ace.edit("assemblyCode");
    editor.setValue("");

    // Helper Functions
    $scope.getRegs = function(){
      return $scope.showAllRegs ? $scope.regs:$scope.regs.slice(0,16);
    }

    // Testing Tokens
    var inst = "add r6,r4,600";
    var tokens = assembler.tokenize(inst);
    console.log(tokens);
}]);

