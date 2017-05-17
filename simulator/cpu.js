app.controller('CPUController', ['$scope', '$window', function($scope,$window) {

    $scope.error = '';
    $scope.mem_disp_size = 255;
    $scope.continue = "Run"
    $scope.show_all_regs = false;
	$scope.regs = simulator.reg_file;
	$scope.clock = 0;
	$scope.memory = memory;
	$scope.mips_conv;
	$scope.mips_assemble;

	// Buffers
	$scope.if_is_buffer = simulator.if_is_buffer;
	$scope.is_rf_buffer = simulator.is_rf_buffer;
    $scope.rf_ex_buffer = simulator.rf_ex_buffer;
    $scope.ex_df_buffer = simulator.ex_df_buffer;
    $scope.df_ds_buffer = simulator.df_ds_buffer;
    $scope.ds_tc_buffer = simulator.ds_tc_buffer;
    $scope.tc_wb_buffer = simulator.tc_wb_buffer;
	$scope.branch_table = branch_predictor.branch_table;
	$scope.stack = procedure_stack.stack;

	var instr = [];
	var editor;
	var code = [];

	$scope.$on('$routeChangeSuccess', function() {
		// Init Editor
		if(window.location.href.indexOf("cpu") == -1 &&window.location.href.indexOf("memory") == -1){
			editor = ace.edit("assemblyCode");
			var assemblyMode = require("ace/mode/assembly_x86").Mode;
			editor.getSession().setMode(new assemblyMode());
			editor.setValue(code_buffer.get_str());
		}
    });

	$scope.goTo = function(tab){
		$("#editor_tab, #mem_tab, #cpu_tab, #mips_conv, #btb").removeClass("active");
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
				if(code_buffer.is_assemble){
					$("#cpu_tab").addClass("active");
					window.location.href = "#cpu";
				}else
					$scope.error = "You need to assemble code first";
				break;
			case 3:
				$("#btb").addClass("active");
				window.location.href = "#btb";
				break;
			case 4:
				$("#mips_conv").addClass("active");
				window.location.href = "#convertor";
				break;
		}
	};

    // Helper Functions
    $scope.getRegs = function(){
      return $scope.show_all_regs ? $scope.regs:$scope.regs.slice(0,16);
    };

	$scope.reset = function(){
		$scope.goTo(0);
		$scope.clock = 0;
		code = [];
		instr = [];
		memory.reset();
		simulator.reset_reg_file();
		code_buffer.reset_code();
		//hazard_unit.reset_signals();
		flush_buffer(simulator.if_is_buffer)
		flush_buffer(simulator.is_rf_buffer);
		flush_buffer(simulator.rf_ex_buffer);
		flush_buffer(simulator.ex_df_buffer);
		flush_buffer(simulator.df_ds_buffer);
		flush_buffer(simulator.ds_tc_buffer);
		flush_buffer(simulator.tc_wb_buffer);
		simulator.pc=0;
	};


	$scope.assemble = function(){
		code = editor.getValue().split('\n');
		code_buffer.set_code(code);
		var error = false;
		console.log(code);
		for(var i = 0; i<code.length; i++){
			if(code[i].trim() != ""){
				try{
					var binary = assembler.assemble(code[i]);
					console.log("Binary");
					console.log(binary);
					for(var j = 0; j<binary.length; j++) instr.push(binary[j]);
				}catch(err){
					error=  true;
					$scope.error = "Syntax Error in Line #: "+(i+1);
                 	if(!$scope.$$phase) $scope.$apply();
					alert("Syntax Error in Line #: "+(i+1));
					break;
				}
			}
		}
		if(!error){
			simulator.set_code(code);
			simulator.set_instr(instr);
			code_buffer.is_assemble = true;
			$scope.goTo(2);	
		}
	};

    $scope.step = function(){
		simulator.hazard_signals = hazard_unit.get_signals();
		$scope.hazard_signals = simulator.hazard_signals;
    	simulator.wb();
    	simulator.tc();
    	simulator.ds();
    	simulator.df();
    	simulator.ex();
    	simulator.rf();
    	simulator.is();
    	simulator.if();
		if(simulator.hazard_signals.stall)
    		simulator.hazard_signals.stall--;
    	$scope.clock ++;
    };

	$scope.mips_convert = function(){
		try{
			binary = assembler.assemble($scope.mips_conv);
			$scope.mips_assemble = binary;
		}catch(ex){
			$scope.mips_assemble = "Syntax Error";
		}
	}

}]);

