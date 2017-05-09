app.controller('CPUController', ['$scope', '$window', function($scope,$window) {

    $scope.error = '';
    $scope.mem_disp_size = 255;
    $scope.continue = "Run"
    $scope.show_all_regs = false;
	$scope.regs = simulator.reg_file;
	$scope.clock = 0;
	$scope.memory = memory;
	
	// Buffers
	$scope.if_is_buffer = simulator.if_is_buffer;
	$scope.is_rf_buffer = simulator.is_rf_buffer;
    $scope.rf_ex_buffer = simulator.rf_ex_buffer;
    $scope.ex_df_buffer = simulator.ex_df_buffer;
    $scope.df_ds_buffer = simulator.df_ds_buffer;
    $scope.ds_tc_buffer = simulator.ds_tc_buffer;
    $scope.tc_wb_buffer = simulator.tc_wb_buffer;


	var instr = [];
	var editor;
	var code = [];

	$scope.$on('$routeChangeSuccess', function() {
		// Init Editor
		editor = ace.edit("assemblyCode");
		project = "";
		for(var i = 0; i<code.length; i++) 
			project += code[i]+"\n";
        editor.setValue(project);
    });

	$scope.goTo = function(tab){
		$("#editor_tab, #mem_tab, #cpu_tab").removeClass("active");
		switch(tab){
			case 0: 
				$("#editor_tab").addClass("active");
				window.location.href = "#editor";
				break;
			case 1:
				$("#mem_tab").addClass("active");
				window.location.href = "#memory";
				break;
			case 2:
				$("#cpu_tab").addClass("active");
				window.location.href = "#cpu";
				break;
		}
	};

    // Helper Functions
    $scope.getRegs = function(){
      return $scope.show_all_regs ? $scope.regs:$scope.regs.slice(0,16);
    };


	$scope.assemble = function(){
		code = editor.getValue().split('\n');
		console.log("From Assemble");
		console.log(code);
		for(var i = 0; i<code.length; i++)
			instr.push(assembler.assemble(code[i]));
		simulator.set_instr(instr);
		$scope.goTo(2);
	};

    $scope.step = function(){
    	console.log("Clock " + $scope.clock.toString() + " begin.");
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

    	console.log("Clock " + $scope.clock.toString() + " end.\n\n");
    	$scope.clock ++;
    };
}]);

