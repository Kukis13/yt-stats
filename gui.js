window.onload = function() {
    Chart.scaleService.updateScaleDefaults('linear', {
        ticks: {
            min: 0
        }
    });

    let promise = browser.storage.local.get();
    promise.then(onGot, onError);
}

function onGot(obj) {
    var videoNames = Object.keys(obj);
    var newVideoNames = [];
    var newVideoCounts = [];
    var videoCounts = Object.values(obj);
    var j = 0;
    for (var i = 0; i < videoNames.length; i++) {
        if (!videoNames[i].startsWith("=")) {
            newVideoNames[j] = videoNames[i].substring(0, videoNames[i].length - 10);
            newVideoCounts[j] = videoCounts[i];
            j++;
            if (j > 50)
                break;
        }
    }
	
	sort(newVideoNames, newVideoCounts);

    var ctx = document.getElementById('myChart').getContext('2d');
    var myBarChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: newVideoNames,
            datasets: [{
                label: "Favourite videos",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: newVideoCounts,
            }]
        }
    });
}

function sort(videoNames, videoCounts){
	for(var i=0; i<videoCounts.length; i++){
		for(var j=i; j<videoCounts.length; j++){
			if(videoCounts[i] < videoCounts[j]){
				let tempName = videoNames[i];
				let tempCount = videoCounts[i];
				
				videoNames[i] = videoNames[j];
				videoCounts[i] = videoCounts[j];
				
				videoNames[j] = tempName;
				videoCounts[j] = tempCount;
			}
		}
	}
}


function onError(error) {
    console.log("ERROR");
}