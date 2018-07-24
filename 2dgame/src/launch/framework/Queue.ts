
function Queue_new(){
	return {first : 0, last : -1}
}

function Queue_size(queue){
	if(! queue ){ return 0 }
	if(queue.first > queue.last ){ return 0 }
	return (queue.last - queue.first + 1)
}

function Queue_empty(queue){
	return 0 == Queue_size(queue)
}

function Queue_first(queue){
	if(! queue ){ return null }
	var first = queue.first
	if(first > queue.last ){ return null }
	return queue[first]
}

function Queue_last(queue){
	if(! queue ){ return null }
	var last = queue.last
	if(queue.first > last ){ return null }
	return queue[last]	
}

function Queue_push_first(queue, v){
	var first = queue.first - 1
	queue.first = first
	queue[first] = v
}

function Queue_push_last(queue, v){
	var last = queue.last + 1
	queue.last = last
	queue[last] = v
}

function Queue_pop_first(queue){
	var first = queue.first
	if(first > queue.last ){ return null }
	var v = queue[first]
	delete queue[first] 
	queue.first = first + 1
	return v
}

function Queue_pop_last(queue,v){
	var last = queue.last
	if(queue.first > last ){ return null }
	var v = queue[last]
	delete queue[last] 
	queue.last = last - 1
	return v
}
