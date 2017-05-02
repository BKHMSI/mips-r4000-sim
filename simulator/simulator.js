var simulator = {

    pc,
    i_cache:  new Uint32Array(256),
    reg_file: new Uint32Array(32),
    buffer_1: new buffer(),
    buffer_2: new buffer(),
    buffer_3: new buffer(),
    buffer_4: new buffer(),
    buffer_5: new buffer(),
    buffer_6: new buffer(),
    buffer_7: new buffer(),

    set_instr: function(instr){
        for(var i = 0; i<instr.length; i++)
            this.i_cache[i] = instr[i]
    },


    wb: function(){
        if(buffer_7.regwrite_en_ctrl)
            reg_file[buffer_7.reg_dst] = (buffer_7.memtoreg_ctrl) ? buffer_7.data_from_mem : buffer_7.alu_out;
        copy_buffer(buffer_7, buffer_6)
    },

    tc: function(){
        copy_buffer(buffer_6, buffer_5)
    },

    ds: function(){
         if(buffer_5.mem_write_en_ctrl)
            store_word(buffer_5.alu_out, buffer_5.reg_rd_2);
        buffer_6.data_from_mem = load_word(buffer_5.alu_out); 
        copy_buffer(buffer_5, buffer_4);
    },

    df: function(){
        
        copy_buffer(buffer_4, buffer_3);
    },

    ex: function(alu_fn_ctrl, alu_in_ctrl, reg_rd_1, reg_rd_2, sign_imm, reg_dst_ctrl){
        var alu_in_2, alu_out, z_flag;
        if(!alu_in_ctrl)
            alu_in_2 = buffer2.reg_rd_2;
        else
            alu_in_2 = buffer2.sign_imm;
        switch(alu_fn_ctrl){
            case 0: alu_out = buffer2.reg_rd_1 + alu_in_2; break;
            case 1: alu_out = buffer2.reg_rd_1 - alu_in_2; break;
            case 2: alu_out = buffer2.reg_rd_1 & alu_in_2; break;
            case 3: alu_out = buffer2.reg_rd_1 | alu_in_2; break;
            case 4: alu_out = buffer2.reg_rd_1 ^ alu_in_2; break;
            case 5: alu_out = buffer2.reg_rd_1 >> alu_in_2; break;
            case 6: alu_out = buffer2.reg_rd_1 << alu_in_2; break;
            case 7: alu_out = buffer2.reg_rd_1 >>> alu_in_2; break;
            case 8: alu_out = (buffer2.reg_rd_1 < alu_in_2) ? 1 : 0; break;
        }
        if(alu_out == 0)
            z_flag = 1;
        else
            z_flag = 0;
        buffer_4.reg_dst = (reg_dst_ctrl) ? buffer_3.addrI_dst : buffer_3.addrR_dst;
        buffer_4.pcbranch = buffer_3.pcplus4 + buffer_3.sign_imm * 4;
        copy_buffer(buffer_3, buffer_2);
    },
    rf: function(){
        var ra1,ra2;
        ra1 = (buffer2.instr<<8)>>27;
        ra2 = (buffer2.instr<<13)>>27;
        buffer_3.reg_rd_1 = reg_file[ra1];
        buffer_3.reg_rd_2 = reg_file[ra2];
        buffer_3.addrI_dst = ra2;
        buffer_3.addrR_dst = (buffer2.instr<<18)>>27;
        buffer_3.sign_imm = (buffer_2.instr<<16)>>>16;
        copy_buffer(buffer_2, buffer_1);
    },
    is: function(){
       buffer_2.instr = i_cache[this.pc>>2]
    },  
    
    if: function(){
        buffer_1.pcplus4 = pc + 4;
    }
}