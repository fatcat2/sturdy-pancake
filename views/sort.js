function sortTable(n){
	var table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById("myTable");
	switching = true;
	console.log("Sorting");
	while(switching){
		switching = false;
		rows = table.getElementsByTagName('tr');
		for(i = 1; i < (rows.length - 1); i++){
			shouldSwitch = false;
			
			x = rows[i].getElementsByTagName("td")[n];
			y = rows[i+1].getElementsByTagName("td")[n];

			// console.log(x.innerHTML);
			// console.log(y.innerHTML);
			if(n == 4){
				var x_int = Number(x.innerHTML);
				var y_int = Number(y.innerHTML);
				if(x_int > y_int){
					shouldSwitch = true;
					break;
				}
			}else{
				if(x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()){
					shouldSwitch = true;
					break;
				}
			}
		}

		if(shouldSwitch){
			rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
			console.log("switched");
			switching = true;
		}
	}
}
