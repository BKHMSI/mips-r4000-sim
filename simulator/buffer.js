function buffer() {
    this.instr;
    this.pc_plus4;
    this.reg_rd_1;
    this.reg_rd_2;
    this.sign_imm;
    this.addrI_dst;
    this.addrR_dst;
    this.z_flag;
    this.pcbranch;
    this.write_data;
    this.write_reg;
    this.data_from_mem;
    this.alu_out;
    this.reg_dst;
    this.memtoreg_ctrl;
    this.alusrc_ctrl;
    this.regwrite_en_ctrl;
    this.jump_ctrl;
    this.mem_write_en_ctrl;
    this.pc_src_ctrl;
    this.alu_func_ctrl;
    this.reg_dst_ctrl;
    this.branch_ctrl;
    this.bne_ctrl;
    this.rs;
}
function copy_buffer(x, y) {
    x.instr = y.instr;
    x.pc_plus4 = y.pc_plus4;
    x.reg_rd_1 = y.reg_rd_1;
    x.reg_rd_2 = y.reg_rd_2;
    x.sign_imm = y.sign_imm;
    x.addrI_dst = y.addrI_dst;
    x.addrR_dst = y.addrI_dst;
    x.z_flag = y.z_flag;
    x.pcbranch = y.pcbranch;
    x.write_data = y.write_data;
    x.write_reg = y.write_reg;
    x.data_from_mem = y.data_from_mem;
    x.alu_out = y.alu_out;
    x.reg_dst = y.reg_dst;
    x.memtoreg_ctrl = y.memtoreg_ctrl;
    x.alusrc_ctrl = y.alusrc_ctrl;
    x.regwrite_en_ctrl = y.regwrite_en_ctrl;
    x.jump_ctrl = y.jump_ctrl;
    x.mem_write_en_ctrl = y.mem_write_en_ctrl;
    x.pc_src_ctrl = y.pc_src_ctrl;
    x.alu_func_ctrl = y.alu_func_ctrl;
    x.reg_dst_ctrl = y.reg_dst_ctrl;
    x.branch_ctrl = y.branch_ctrl;
    x.bne_ctrl = y.bne_ctrl;
    x.rs = y.rs;
}

function flush_buffer(x){
	for(signal in x)
		x[signal] = 0;
}