var hazard_unit = {

	get_signals : function(){
		var signals = {forward_a:0,forward_b:0,forward_c:0,stall:0,flush:0};
		// forwarding(a)
		if (simulator.rf_ex_buffer.rs == simulator.ex_df_buffer.reg_dst && simulator.ex_df_buffer.regwrite_en_ctrl){
			signals.forward_a = 4;
		}
		else if (simulator.rf_ex_buffer.rs == simulator.df_ds_buffer.reg_dst && simulator.df_ds_buffer.regwrite_en_ctrl){
			signals.forward_a = 3;
		}
		else if (simulator.rf_ex_buffer.rs == simulator.ds_tc_buffer.reg_dst && simulator.ds_tc_buffer.regwrite_en_ctrl){
			signals.forward_a = 2;
		}
		else if (simulator.rf_ex_buffer.rs == simulator.tc_wb_buffer.reg_dst && simulator.tc_wb_buffer.regwrite_en_ctrl){
			signals.forward_a = 1;
		}
		else{
			signals.forward_a = 0;
		}

		// forwarding(b)
		if (simulator.rf_ex_buffer.addrI_dst == simulator.ex_df_buffer.reg_dst && simulator.ex_df_buffer.regwrite_en_ctrl){
			signals.forward_b = 4;
		}
		else if (simulator.rf_ex_buffer.addrI_dst == simulator.df_ds_buffer.reg_dst && simulator.df_ds_buffer.regwrite_en_ctrl){
			signals.forward_b = 3;
		}
		else if (simulator.rf_ex_buffer.addrI_dst == simulator.ds_tc_buffer.reg_dst && simulator.ds_tc_buffer.regwrite_en_ctrl){
			signals.forward_b = 2;
		}
		else if (simulator.rf_ex_buffer.addrI_dst == simulator.tc_wb_buffer.reg_dst && simulator.tc_wb_buffer.regwrite_en_ctrl){
			signals.forward_b = 1;
		}
		else{
			signals.forward_b = 0;
		}

		//forwarding(c)
		if(simulator.ds_tc_buffer.memtoreg_ctrl && simulator.ds_tc_buffer.reg_dst == simulator.df_ds_buffer.reg_dst){
			signals.forward_c = 2;
		}else if(simulator.tc_wb_buffer.memtoreg_ctrl && simulator.tc_wb_buffer.reg_dst == simulator.df_ds_buffer.reg_dst){
			signals.forward_c = 1;
		}

		if(simulator.ds_tc_buffer.memwrite_en_ctrl){
			if(simulator.ds_tc_buffer.reg_dst == simulator.rf_ex_buffer.rs)
				signals.forward_ae = 1;
			if(simulator.ds_tc_buffer.reg_dst == simulator.rf_ex_buffer.addrI_dst)
				signals.forward_be = 1;
		}

		// stalling

		rs = (simulator.is_rf_buffer.instr >> 21) & 0x1F;
		rt = (simulator.is_rf_buffer.instr >> 16) & 0x1F;
		rd_1 = simulator.ex_df_buffer.reg_dst;
		rd_2 = simulator.df_ds_buffer.reg_dst;

		signals.stall = signals.flush = 0;

		if(simulator.df_ds_buffer.memtoreg_ctrl && (rd_2 == rt || rd_2 == rs)){
    		signals.stall = 1;
    		signals.flush = 1;
		}


		if(simulator.ex_df_buffer.memtoreg_ctrl && (rd_1 == rt || rd_1 == rs)){
    		signals.stall = 2
    		signals.flush = 1;
		}

		return signals;

	}

} 