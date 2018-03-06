chrome.extension.onMessage.addListener(receiveMessage);

var vk_settings, body, page_wrap, backgrounds_block, page_layout, backgrounds_app;

function receiveMessage(object){
	var act = object.act;
	if(act == 'update_settings'){
		getItem('vk_app_settings', updatePage);
	}
}
function updatePage(object){
	vk_settings = object.vk_app_settings;
	var enabled = vk_settings.switchers.extension;
	if(enabled){
		enable();
	}else{
		disable();
	}
}
function enable(){
	toggleOpacity(vk_settings.switchers.opacity);
	toggleStroke(vk_settings.switchers.stroke);
	toggleBackground(true);
}
function disable(){
	toggleOpacity(false);
	toggleStroke(false);
	toggleBackground(false);
}
function toggleBackground(bool){
	backgrounds_block = $('#vk-backgrounds-block');
	if(bool){
		var background = vk_settings.backgrounds.array[vk_settings.backgrounds.current];
		if(backgrounds_block.length){
			background_block = $('.vk-background-block');
			backgrounds_block.show();
			background_block.css('background-image','url('+background.url+')');
		}else{
			var backgrounds_block = $('<div id="vk-backgrounds-block"></div>');
			var background_block = $('<div class="vk-background-block"></div>');
			background_block.css('background-image','url('+background.url+')');
			backgrounds_block.append(background_block);
			backgrounds_block.css('position', 'fixed');
			page_wrap = $('#page_wrap');
			page_wrap.append(backgrounds_block);
		}
	}else{
		backgrounds_block.hide();
	}
}
function toggleStroke(bool){
	page_layout = $('#page_layout');
	var stroke = vk_settings.site.stroke;
	if(bool){
		page_layout.css('box-shadow', '0 0 '+stroke.blur+'px '+stroke.size+'px rgba('+colorToString(stroke.color, stroke.opacity)+')');
		page_layout.css('padding', '0 20px');
	}else{
		page_layout.css('box-shadow', '0 0 '+stroke.blur+'px '+stroke.size+'px rgba('+colorToString(stroke.color, 0)+')');
	}
}
function toggleOpacity(bool){
	body = $('body');
	page_layout = $('#page_layout');
	var page = vk_settings.site.page;
	if(bool){
		body.attr('id', 'vk_bg_extension');
		page_layout.css('background-color', 'rgba('+colorToString(page.color, page.opacity)+')');
	}else{
		body.removeAttr('id');
		page_layout.css('background-color', '#edeef0');
	}
}
function colorToString(object, alpha = 100){
	return object.r+','+object.g+','+object.b+','+alpha/100;
}
receiveMessage({
	act: 'update_settings'
});