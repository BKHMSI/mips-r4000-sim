var simulator = {

    pc : 0,
    i_cache:  new Uint32Array(256),
    reg_file: new Uint32Array(32),
    if_is_buffer: new buffer(),
    is_rf_buffer: new buffer(),
    rf_ex_buffer: new buffer(),
    ex_df_buffer: new buffer(),
    df_ds_buffer: new buffer(),
    ds_tc_buffer: new buffer(),
    tc_wb_buffer: new buffer(),
	hazard_signals: {forward_a:0,forward_b:0,stall:0,flush:0},

    set_instr: function(instr){
        for(var i = 0; i<instr.length; i++)
            this.i_cache[i] = instr[i];
    },


    wb: function(){
        if(this.tc_wb_buffer.regwrite_en_ctrl){
        	var reg_dst = (this.tc_wb_buffer.reg_dst_ctrl) ? this.tc_wb_buffer.addrR_dst : this.tc_wb_buffer.addrI_dst;
            this.reg_file[reg_dst] = (this.tc_wb_buffer.memtoreg_ctrl) ? this.tc_wb_buffer.data_from_mem : this.tc_wb_buffer.alu_out;
            console.log(this.reg_file);
        }
    },

    tc: function(){
    	if(!this.hazard_signals.stall)
    		copy_buffer(this.tc_wb_buffer, this.ds_tc_buffer);

    },

    ds: function(){
    	if(!this.hazard_signals.stall)
    		copy_buffer(this.ds_tc_buffer, this.df_ds_buffer);
    	if(this.df_ds_buffer.mem_write_en_ctrl)
            memory.store_word(this.df_ds_buffer.write_data, this.df_ds_buffer.reg_rd_2);
        this.ds_tc_buffer.data_from_mem = memory.load_word(this.df_ds_buffer.alu_out);

    },

    df: function(){
    	if(!this.hazard_signals.stall)
    		copy_buffer(this.df_ds_buffer, this.ex_df_buffer);

    },

    ex: function(){

    	if(!this.hazard_signals.stall)
        	copy_buffer(this.ex_df_buffer, this.rf_ex_buffer);
       	else
       		flush_buffer(this.rf_ex_buffer)

    	var sign_imm = this.rf_ex_buffer.sign_imm;
    	var alu_fn_ctrl = this.rf_ex_buffer.alu_fn_ctrl;
    	var alusrc_ctrl = this.rf_ex_buffer.alusrc_ctrl;
    	var alu_input_1;
    	var alu_input_2;
    	
    	switch(this.hazard_signals.forward_a){
    		case 4: alu_input_1 = this.df_ds_buffer.alu_out; break;
    		case 3: alu_input_1 = this.ds_tc_buffer.alu_out; break;
    		case 2: alu_input_1 = this.tc_wb_buffer.alu_out; break;
    		case 1: alu_input_1 = this.ds_tc_buffer.data_from_mem; break;
    		case 0: alu_input_1 = this.rf_ex_buffer.reg_rd_1; break;
    	}

    	switch(this.hazard_signals.forward_b){
			case 4: alu_input_2 = this.df_ds_buffer.alu_out; break;
    		case 3: alu_input_2 = this.ds_tc_buffer.alu_out; break;
    		case 2: alu_input_2 = this.tc_wb_buffer.alu_out; break;
    		case 1: alu_input_2 = this.ds_tc_buffer.data_from_mem; break;
    		case 0: alu_input_2 = this.rf_ex_buffer.reg_rd_2; break;
    	}

    	this.ex_df_buffer.write_data = alu_input_2;
    	alu_input_2 = (alusrc_ctrl) ? sign_imm : this.rf_ex_buffer.reg_rd_2
    	var alu_out;
        switch(this.rf_ex_buffer.alu_func_ctrl){
            case 0: alu_out = alu_input_1 + alu_input_2; break;
            case 1: alu_out = alu_input_1 - alu_input_2; break;
            case 2: alu_out = alu_input_1 & alu_input_2; break;
            case 3: alu_out = alu_input_1 | alu_input_2; break;
            case 4: alu_out = alu_input_1 ^ alu_input_2; break;
            case 5: alu_out = alu_input_1 >> alu_input_2; break;
            case 6: alu_out = alu_input_1 << alu_input_2; break;
            case 7: alu_out = alu_input_1 >>> alu_input_2; break;
            case 8: alu_out = (alu_input_1 < alu_input_2) ? 1 : 0; break;
        }
        var z_flag = alu_out == 0;
        this.ex_df_buffer.reg_dst = (this.rf_ex_buffer.reg_dst_ctrl) ? this.rf_ex_buffer.addrI_dst : this.rf_ex_buffer.addrR_dst;
        this.ex_df_buffer.pcbranch = this.rf_ex_buffer.pcplus4 + this.rf_ex_buffer.sign_imm * 4;
        this.ex_df_buffer.alu_out = alu_out;
    },

    rf: function(){
    	if(!this.hazard_signals.stall)
    		copy_buffer(this.rf_ex_buffer, this.is_rf_buffer);
    	var rf_instr = this.is_rf_buffer.instr;
    	var opcode = rf_instr >> 26;
    	var sign_imm = (rf_instr << 16) >>> 16;
    	var rs = (rf_instr >> 21) & 0x1F;
    	var rt = (rf_instr >> 16) & 0x1F;
    	var rd = (rf_instr >> 11) & 0x1F;
    	var funct = rf_instr & 0x3F;

    	var control_signals = control_unit.get_signals(opcode, funct);
    	var ra1 = this.reg_file[rs];
    	var ra2 = this.reg_file[rt];

    	if(rf_instr == undefined){
    		opcode = sign_imm = rs = rt = rd = funct = control_signals = ra1 = ra2 = undefined;
    	}

        for (var control_signal in control_signals){
        	var signal_value = control_signals[control_signal];
        	this.rf_ex_buffer[control_signal] = signal_value;
        }
		
        this.rf_ex_buffer.sign_imm = sign_imm;
        this.rf_ex_buffer.reg_rd_1 = ra1;
        this.rf_ex_buffer.reg_rd_2 = ra2;
        this.rf_ex_buffer.addrI_dst = rt;
        this.rf_ex_buffer.addrR_dst = rd;
        this.rf_ex_buffer.rs = rs;
    },
    is: function(){
    	if(!this.hazard_signals.stall)
    		copy_buffer(this.is_rf_buffer, this.if_is_buffer);
    	var is_pc = this.if_is_buffer.pc;
    	var is_instr = this.i_cache[is_pc / 4];
    	this.is_rf_buffer.pc_plus4 = (is_pc == undefined) ? undefined : is_pc + 4;
    	this.is_rf_buffer.instr = (is_instr == undefined) ? undefined : is_instr;
    },  
    
    if: function(){
    	//Branch logic selects an instruction address and the instruction cache fetch begins
    	this.if_is_buffer.pc = this.pc;
    	
    	var if_pc_plus4 = this.pc + 4;
    	//TODO: Branch / Jump logic
    	this.pc = if_pc_plus4;
    }
}