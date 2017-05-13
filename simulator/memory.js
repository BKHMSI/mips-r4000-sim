var memory = {
    data: new Uint8Array(1024),
    last_access: -1,
    load: function (address) {
        var self = this;
        if (address < 0 || address >= self.data.length) {
            throw "Memory access violation at " + address;
        }

        self.last_access = address;
        return self.data[address];
    },

    load_word: function(address){
        var self = this;
        var value = 0;
        if (address < 0 || address >= self.data.length) {
            throw "Memory access violation at " + address;
        }
    
        self.last_access = address;
        value = self.data[address+3];
        value += self.data[address+2]<<8;
        value += self.data[address+1]<<16;
        value += self.data[address]<<24;
        return value;
    },

    load_half: function(address){
        var self = this;
        var value = 0;
        if (address < 0 || address >= self.data.length) {
            throw "Memory access violation at " + address;
        }

        self.last_access = address;
        value = self.data[address];
        value += self.data[address+1]<<8;
        return value;
    },

    store: function (address, value) {
        var self = this;

        if (address < 0 || address >= self.data.length) {
            throw "Memory access violation at " + address;
        }

        self.last_access = address;
        self.data[address] = value;
    },

    store_half: function (address, value) {
        var self = this;
        var first = value & 0xFF;
        var second = (value>>8) & 0xFF;

        if (address < 0 || address >= self.data.length) {
            throw "Memory access violation at " + address;
        }

        self.last_access = address;
        self.data[address] = first;
        self.data[address+1] = second;
    },

    store_word: function (address, value) {
        var self = this;
        var first = value & 0xFF;
        var second = (value>>8) & 0xFF;
        var third = (value>>16) & 0xFF;
        var fourth = (value>>24) & 0xFF;

        if (address < 0 || address >= self.data.length) {
            throw "Memory access violation at " + address;
        }

        self.last_access = address;
        self.data[address] = fourth;
        self.data[address+1] = third;
        self.data[address+2] = second;
        self.data[address+3] = first;
    },

    reset: function () {
        var self = this;
        self.last_access = -1;
        for (var i = 0, l = self.data.length; i < l; i++) {
            self.data[i] = 0;
        }
    },

    subset: function(start,end){
        var mem = new Uint8Array(end-start);
        for(var i = start; i<=end; i++)
        mem[i] = this.data[i];
        return mem;
    }
}

code_buffer = {
    code: [],
    is_assemble: false,
    set_code: function(instr){
        for(var i = 0; i<instr.length; i++)
            this.code.push(instr[i])
    },

    get_str: function(){
        project = "";
        for(var i = 0; i<this.code.length; i++) 
            project += this.code[i]+(i == this.code.length-1 ? "":"\n")
        return project;
    },

    reset_code: function(){
        this.is_assemble = false;
        while(this.code.length)
            this.code.pop();
    }

}