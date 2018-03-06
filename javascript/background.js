
chrome.extension.onMessage.addListener(receiveMessage);
chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onStartup.addListener(onStartup);

function onStartup(object){
	getItem('vk_app_settings', function(object){
		if(object.vk_app_settings.switchers.extension && object.vk_app_settings.switchers.rotation){
			changeBackground();
			toggleTimer();
		}
		if(object.vk_app_settings.switchers.extension){
			toggleContextMenu(true);
		}
	});
}
function onInstalled(object){
	var reason = object.reason;
	var previous_version = parseFloat(object.previousVersion);
	var current_version = VK_app.info.current_version;
	if(reason == "install"){
		setDefaultSettings();
		createTab('html/installed.html');
		_gaq.push(['_trackEvent', 'extensionInstalled', 'version = ' + current_version]);
		checkInfo();
	}else if(reason == "update"){
		if(previous_version < current_version){
			checkInfo();
			_gaq.push(['_trackEvent', 'extensionUpdated', 'old = ' + previous_version + ' / new = ' + current_version]);
			if(previous_version < 4){
				createTab('html/installed.html');
				setDefaultSettings();
			}
		}
		getItem('vk_app_settings', function(object){
			toggleContextMenu(object.vk_app_settings.switchers.extension);
		});
	}
}

function setDefaultSettings(){
	setItem('vk_app_settings', VK_defaults, toggleContextMenu(true));
	toggleTimer();
}
function toggleContextMenu(enabled){
	if(enabled){
		chrome.contextMenus.create({
			id: VK_app.info.extension_id,
			title: "Установить как фон ВКонтакте",
			contexts: ["image"],
			onclick: addBackground
		});
	}else{
		chrome.contextMenus.removeAll();
	}
}
function checkInfo(){
	getItem('vk_app_info', function(object){
		if(Object.keys(object).length === 0){
			setItem('vk_app_info', {
				install_time: getCurrentTime()
			}, function(){
				_gaq.push(['_trackEvent', 'setInstallTime', 'time']);	
			});
		}
	});
}
function addBackground(object, page){
	var url = object.srcUrl;
	getItem('vk_app_settings', function(object){
		var vk_settings = object.vk_app_settings;
		var already_exist = false;
		$.each(vk_settings.backgrounds.array, function(index, object){
			if(url == object.url){
				already_exist = true;
				return false;
			}
		});
		if(already_exist) return false;
		vk_settings.backgrounds.array.push({url: url});
		vk_settings.backgrounds.current = vk_settings.backgrounds.array.length - 1;
		setItem('vk_app_settings', vk_settings, function(){
			sendMessage('content_script', {
				act: 'update_settings'
			});
		});
	});
}
function receiveMessage(message, callback){
	if(message.act == 'toggle_context_menu'){
		toggleContextMenu(message.value);
	}
	if(message.act == 'toggle_timer'){
		toggleTimer(message.value);
	}
	if(message.act == 'reset_settings'){
		_gaq.push(['_trackEvent', 'resetSettings', 'reset']);
		setDefaultSettings();
	}
}

function toggleTimer(bool = true){
	if(bool){
		getItem('vk_app_settings', function(object){
			clearInterval(window.timer);
			var vk_settings = object.vk_app_settings;
			var rotation_time = vk_settings.backgrounds.rotation_time;
			window.timer = setInterval(function(){
				var current_time = getCurrentTime();
				if(current_time >= rotation_time){
					changeBackground();
				}
			}, 5000);
		});
	}else{
		clearInterval(window.timer);
	}
}
function changeBackground(){
	toggleTimer(false);
	getItem('vk_app_settings', function(object){
		var vk_settings = object.vk_app_settings;
		var current_time = getCurrentTime();
		var rotation_time = vk_settings.backgrounds.rotation_time;
		if(current_time >= rotation_time){
			var rotation_delay = VK_app.dropdown_values.time[vk_settings.dropdown_values.time].value;
			rotation_time = current_time + rotation_delay;
			vk_settings.backgrounds.rotation_time = rotation_time;
			var backgrounds = vk_settings.backgrounds.array;
			var current = vk_settings.backgrounds.current;
			var rotation_order = vk_settings.dropdown_values.order;
			if(rotation_order == 'asc'){
				current = ((backgrounds.length - 1) == current) ? 0 : (current + 1);
			}
			if(rotation_order == 'random'){
				while(true){
					var random = getRandom(0, backgrounds.length - 1);
					if(random != current){
						current = random;
						break;
					}
				}
			}
			vk_settings.backgrounds.current = current;
			setItem('vk_app_settings', vk_settings, function(){
				sendMessage('content_script', {
					act: 'update_settings'
				});
				toggleTimer();
			});
		}
	});
}