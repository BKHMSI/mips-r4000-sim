var assembler = {

    map: {
        "add":  0x20,
        "addi":  0x8,
        "sub":  0x22,
        "xor":  0x26,
        "lw":   0x23,
        "sw":   0x2b,
        "beq":   0x4,
        "bne":   0x5,
        "slt":  0x2a,
        "j":     0x2,
        "jal":   0x3,
        "jr":    0x6, // wrong opcode
        "jp":    0x9,
        "jrp":   0xa
    },

    assemble: function(str){
        str = this.normalize(str);
        var tokens = this.tokenize(str);
        var binary = 0;
        var code = [];
        console.log(tokens);
        if(tokens.length == 3){
            // J Format
            console.log("J-Format");
            console.log(tokens);
            if(tokens[0] == "jrp" || tokens[0] == "jr")
                binary = (this.map[tokens[0]]<<26);
            else 
                binary = (this.map[tokens[1]]<<26)+parseInt(tokens[2]);
        }else if(tokens[5] == null){
            // R Format
            console.log("R-Format");
            console.log(tokens)
            if(tokens[1] == "sw" || tokens[1] == "lw")
                binary = (this.map[tokens[1]] << 26)+(parseInt(tokens[4])<<21)+(parseInt(tokens[2])<<16)+(parseInt(tokens[3]) & 0xFFFF);
            else  
                binary = (0<<26)+(parseInt(tokens[3])<<21)+(parseInt(tokens[4])<<16)+(parseInt(tokens[2])<<11)+(0<<6)+this.map[tokens[1]];
        }else{
            // I Format
            console.log("I-Format");
            console.log(tokens);
            if(this.is_pseudo(tokens[1])){
                return this.assemble_pseudo(tokens);
            }else{
                var imm = parseInt(tokens[5]) & 0xFFFF;
                binary = (this.map[tokens[1]] << 26)+(parseInt(tokens[3])<<21)+(parseInt(tokens[2])<<16)+(imm);
            }
        }
        code.push(binary);
        return code;
    },

    tokenize: function(str){

        // add r1, r2, r3 or addi r1, r2, 5
        var rgx_1 = "([a-z]{3,4})[rR$](3[01]|[12]?[0-9]),[rR$](3[01]|[12]?[0-9]),(?:(?:[rR$](3[01]|[12]?[0-9]))|(-?[0-9]+))";
        // lw r1, 0(r3)
        var rgx_2 =  "([a-z]{2,4})[rR$]([12]?[0-9]|3[01]),[rR$]?([12]?[0-9]|3[01]|[0-9]+)[rR$]([12]?[0-9]|3[01])";
        // jal 500
        var rgx_3 =  "(j|jal|jp)(-?[0-9]+)|jrp|jr";

        if(str.match(rgx_1))
            return new RegExp(rgx_1).exec(str);
        else if(str.match(rgx_2))
            return new RegExp(rgx_2).exec(str);
        else if(str.match(rgx_3))
            return new RegExp(rgx_3).exec(str);
        else
            throw 400;
    },

    is_pseudo: function(memonic){
        return memonic == "ble";
    },

    assemble_pseudo: function(tokens){
        binary = [];
        if(tokens[1] == "ble"){
            var imm = parseInt(tokens[5]) & 0xFFFF;
            binary.push((0<<26)+(parseInt(tokens[2])<<21)+(parseInt(tokens[3])<<16)+(7<<11)+(0<<6)+this.map["slt"]);
            binary.push((this.map["beq"] << 26)+(7<<21)+(0<<16)+(imm));
        }
        return binary;
    },

    normalize: function(str){
        return str = str.replace(/[\(\) ]/g,'').toLowerCase();
    }
}