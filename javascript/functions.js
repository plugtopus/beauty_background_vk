function sendMessage(type, object){
	if(type == 'content_script'){
		chrome.tabs.query({}, function(tabs){
			for(var i = 0; i < tabs.length; ++i){
				chrome.tabs.sendMessage(tabs[i].id, object);
			}
		});
	}else if(type == 'event_page'){
		chrome.extension.sendMessage(object);
	}
}
function setItem(object, value, callback = null){
	chrome.storage.local.set({[object]: value}, callback);
}
function getItem(object, callback){
	chrome.storage.local.get([object], callback);
}
function createTab(url){
	chrome.tabs.create({
		url: url,
		active: true
	});
}
function log(){console.log.apply(console,arguments)}
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getCurrentTime(){
	return Math.floor(Date.now() / 1000);
}
