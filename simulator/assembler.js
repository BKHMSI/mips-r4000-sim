var assembler = {



    tokenize: function(str){

        // add r1, r2, r3
        var rgx_1 = "([a-z]{3,4})[rR](3[01]|[12]?[0-9]),[rR](3[01]|[12]?[0-9]),(?:(?:[rR](3[01]|[12]?[0-9]))|([0-9]+))";
        // lw r1, 0(r3)
        var rgx_2 =  "([a-z]{2,4})([rR][12]?[0-9]|3[01]),(([rR][12]?[0-9]|3[01])|[0-9]+)\(([rR][12]?[0-9]|3[01])\)";
        // jal 500
        var rgx_3 =  "(j|jal)([0-9]+)";

        str = str.replace(/ /g,'')
        console.log(str);
        if(str.match(rgx_1))
            return new RegExp(rgx_1).exec(str);
        else if(str.match(rgx_2))
            return new RegExp(rgx_2).exec(str);
        else if(str.match(rgx_3))
            return new RegExp(rgx_3).exec(str);
        else
            throw 400;
    },
}