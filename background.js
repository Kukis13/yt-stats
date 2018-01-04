var videoName;
var timeout;
var currentTabId;
var youtubeId;

function onGot(item) {
	let count = 1;
	if(item !== undefined && item !== null && Object.keys(item).length > 0){
		count = item[videoName] + 1;
	}
	var videoStat = {
			[videoName]: count
		};
	browser.storage.local.set(videoStat);
}

browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo && changeInfo.status == "complete"){
		let id = getYoutubeId(tab.url);
		if(id === undefined){
			return;
		}
		browser.alarms.clearAll();
		console.log("Clearing alaram");
		youtubeId = id;
		currentTabId = tab.id;
		findVideoName(youtubeId);
    }
});

function findVideoName(youtubeId){
	let promise = browser.storage.local.get(youtubeId);
	promise.then(onYoutubeIdFound, onError);
}

function getYoutubeId(url){
	if(url === undefined)
		return;
	let indexOfId = url.indexOf('youtube.com/watch?v=');
	if(indexOfId === undefined || indexOfId < 0)
		return;
	
	return url.substring(indexOfId + 19, indexOfId + 30);
}

browser.alarms.onAlarm.addListener(function(){
	console.log("Alarm !");
	let tabListener = browser.tabs.get(currentTabId);
	tabListener.then(incrementVideoCount, onError);
});

function setAlarm(){
	console.log("Setting alarm");
	browser.alarms.create(youtubeId, {
		delayInMinutes: 0.1
	});
}

function onYoutubeIdFound(item){
	setAlarm();
}

function incrementVideoCount(tab){
	videoName = tab.title;
	let youtubeId = getYoutubeId(tab.url);
	let youtubeIdToName = {
		[youtubeId] : videoName
	}
	browser.storage.local.set(youtubeIdToName);
	
	let promise = browser.storage.local.get(videoName);
	promise.then(onGot, onError);
}

browser.browserAction.onClicked.addListener(handleClick);

function handleClick(){
	const url = browser.extension.getURL("gui.html");
	browser.tabs.create({url: url}).then(() => {
	  browser.history.deleteUrl({url: url});
	}).catch((e) => { throw e });
}


function onError(error) {
	console.log("ERROR");
}
