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
      //return $scope.showAllRegs ? $scope.regs:$scope.regs.slice(0,16);
    }
    var clock = 0;
    $scope.step = function(){
    	console.log("Clock " + clock.toString() + " begin.");
    	simulator.wb();
    	simulator.tc();
    	simulator.ds();
    	simulator.df();
    	simulator.ex();
    	simulator.rf();
    	simulator.is();
    	simulator.if();

    	console.log("if_is:");
    	console.log(simulator.if_is_buffer);

    	console.log("is_rf:");
    	console.log(simulator.is_rf_buffer);
    	
    	console.log("rf_ex:");
	    console.log(simulator.rf_ex_buffer);

	    console.log("ex_df:");
	    console.log(simulator.ex_df_buffer);
	        	
	    console.log("df_ds:");
	    console.log(simulator.df_ds_buffer);
	        	
	    console.log("ds_tc:");
	    console.log(simulator.ds_tc_buffer);

	    console.log("tc_wb:");
	    console.log(simulator.tc_wb_buffer);

    	console.log("Clock " + clock.toString() + " end.\n\n");
    	clock ++;
    }

    // Testing Tokens
    var inst = "addi $1, $0, 5";
    var binary = assembler.assemble(inst);
    simulator.set_instr([binary, assembler.assemble("add $2, $0, $1")]);
    console.log(binary.toString(2));
}]);

