var procedure_stack = {
	stack : [],
	push : function(pc){
		this.stack.push(pc);
	},
	pop : function(){
		return this.stack.pop();
	}
}