app.controller('CPUController', ['$scope', '$window', function($scope,$window) {

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

    $scope.step = functino(){
      simulator.stage_1();
      simulator.stage_2();
      simulator.stage_3();
      simulator.stage_4();
      simulator.stage_5();
    }

    // Testing Tokens
    var inst = "j50";
    var binary = assembler.assemble(inst);
    console.log(binary);
}]);

