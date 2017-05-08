var hazard_unit = {

	get_signals : function(){
		var signals = {};
		// forwarding (a)
		if (simulator.rf_ex_buffer.rs == simulator.ex_df_buffer.reg_dst && simulator.ex_df_buffer.reg_write_en_ctrl){
			signals.forward_a = 4;
		}
		else if (simulator.rf_ex_buffer.rs == simulator.df_ds_buffer.reg_dst && simulator.df_ds_buffer.reg_write_en_ctrl){
			signals.forward_a = 3;
		}
		else if (simulator.rf_ex_buffer.rs == simulator.ds_tc_buffer.reg_dst && simulator.ds_tc_buffer.reg_write_en_ctrl){
			signals.forward_a = 2;
		}
		else if (simulator.rf_ex_buffer.rs == simulator.tc_wb_buffer.reg_dst && simulator.tc_wb_buffer.reg_write_en_ctrl){
			signals.forward_a = 1;
		}
		else{
			signals.forward_a = 0;
		}

		// forwarding(b)
		if (simulator.rf_ex_buffer.addrI_dst == simulator.ex_df_buffer.reg_dst && simulator.ex_df_buffer.reg_write_en_ctrl){
			signals.forward_b = 4;
		}
		else if (simulator.rf_ex_buffer.addrI_dst == simulator.df_ds_buffer.reg_dst && simulator.df_ds_buffer.reg_write_en_ctrl){
			signals.forward_b = 3;
		}
		else if (simulator.rf_ex_buffer.addrI_dst == simulator.ds_tc_buffer.reg_dst && simulator.ds_tc_buffer.reg_write_en_ctrl){
			signals.forward_b = 2;
		}
		else if (simulator.rf_ex_buffer.addrI_dst == simulator.tc_wb_buffer.reg_dst && simulator.tc_wb_buffer.reg_write_en_ctrl){
			signals.forward_b = 1;
		}
		else{
			signals.forward_b = 0;
		}


		return signals;

	}

}