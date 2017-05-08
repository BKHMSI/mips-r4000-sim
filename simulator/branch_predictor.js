var branch_predictor = {
	//strongly taken : 0, taken : 1, not taken : 2, strongly not taken: 3
	predict : function(pc){
		for (var btb_entry in branch_table){
			if (btb_entry.valid){
				if(btb_entry.pc == pc){
					if(btb_entry.state == 0 || btb_entry.state == 1)
						return { 
							taken : true,
							branch_pc : btb_entry.branch_address
						};
					else
						return { 
							taken : false,
							branch_pc : btb_entry.branch_address
						};
				}
			}
		}
		return {
			taken : false,
			branch_pc : undefined
		}
	},

	branch_table : [],
	update : function(pc_plus4, branch_address, branch_taken){
		var pc = pc_plus4 - 4;
		var found = false;
		for(var i = 0; i < branch_table.length; i ++){
			var btb_entry = branch_table[i];
			if(btb_entry.valid){
				if(btb_entry.pc == pc){
					if(branch_taken){
						if(btb_entry.state != 0)
							btb_entry.state --;
					}
					else{
						if(btb_entry.state != 3)
							btb_entry.state ++;
					}
					found = true;
				}
			}
		}
	}
}