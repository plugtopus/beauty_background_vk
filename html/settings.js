// chrome.extension.onMessage.addListener(receiveMessage);

var vk_settings, sortable;
getItem('vk_app_settings', settingsLoaded);

function settingsLoaded(object) {
	vk_settings = object.vk_app_settings;
	applySortable();
	renderDropdown('time');
	renderDropdown('order');
	renderSwitchers();
	renderSliders();
	renderColor();
	renderBackgrounds();
	toggleReset();
}

function renderBackgrounds() {
	var backgrounds_block = $('.backgrounds-block');
	$.each(vk_settings.backgrounds.array, function (index, object) {
		var background_url = object.url;
		var background_block = $('<div class="background" data-index=' + index + '></div>');
		var background_image = $('<div class="background-image"></div>');
		background_image.css('background-image', 'url(' + background_url + ')');
		var background_overlay = $('<div class="background-overlay"></div>');
		var delete_icon = $('<div class="delete-icon"></div>');
		var change_icon = $('<div class="change-icon"></div>');
		var background_index = $('<div class="background-index"></div>');
		background_index.text(index + 1);
		background_block.append(background_image);
		background_block.append(background_index);
		background_block.append(background_overlay);
		background_overlay.append(delete_icon);
		background_overlay.append(change_icon);
		delete_icon.click(function () {
			background_block.remove();
			var index = parseInt(background_block.attr('data-index'));
			vk_settings.backgrounds.array.splice(index, 1);
			if (index == vk_settings.backgrounds.current) {
				if (vk_settings.backgrounds.array[index]) {
					vk_settings.backgrounds.current = index;
				} else {
					vk_settings.backgrounds.current = vk_settings.backgrounds.array.length - 1;
				}
			}
			reindexBackgrounds('update_current');
		});
		change_icon.click(function (e) {
			var index = parseInt(background_block.attr('data-index'));
			vk_settings.backgrounds.current = index;
			applySettings('update_current');
		});
		backgrounds_block.append(background_block);
	});
	backgrounds_block.append('<div class="clear"></div>');
	if (vk_settings.backgrounds.array.length == 1) {
		lastBackground();
	}
}

function reindexBackgrounds(event) {
	var backgrounds = $('.background');
	var current_index = vk_settings.backgrounds.current;
	if (backgrounds.length > 1) {
		$.each(backgrounds, function (index) {
			var background_block = $(this);
			var old_index = parseInt(background_block.attr('data-index'));
			if (old_index == current_index) {
				log(old_index, index, vk_settings.backgrounds.current);
				vk_settings.backgrounds.current = index;
				log(vk_settings.backgrounds.current);
				event = 'update_current';
			}
			background_block.attr('data-index', index);
			background_block.find('.background-index').text(index + 1);
		});
	} else {
		lastBackground();
		vk_settings.backgrounds.current = 0;
	}
	applySettings(event);
}

function lastBackground() {
	var background_block = $('.background');
	background_block.find('.background-index').hide();
	background_block.find('.delete-icon').off().remove();
	background_block.find('.current-icon').off().remove();
	background_block.find('.change-icon').off().remove();
	background_block.css('cursor', 'default');
	var switcher_block = $('.switcher-block[data-block=background-rotate]');
	switcher_block.toggleClass('block-disabled');
	switcher_block.removeClass('switcher-enabled');
	var inner_block = $('.inner-block[data-block=background-rotate]');
	inner_block.hide();
	sortable.destroy();
}

function renderColor() {
	var stroke_color = $("#stroke-color");
	applySpectrum(stroke_color, 'stroke');
	var page_color = $('#page-color');
	applySpectrum(page_color, 'page');
}

function applySpectrum(block, name) {
	var value = vk_settings.site[name].color;
	block.spectrum({
		color: value,
		showButtons: false,
		update: function (color) {
			updateColor(name, color);
		}
	});
	block.on("dragstop.spectrum", function (event, color) {
		updateColor(name, color);
	});
}

function updateColor(name, color) {
	var color = color.toRgb();
	applySettings('update_color', {
		name: name,
		value: {
			r: color.r,
			g: color.g,
			b: color.b
		}
	});
}

function renderDropdown(data_menu) {
	var dropdown_menu = $('.dropdown-menu[data-menu=' + data_menu + ']');
	var selected_text = VK_app.dropdown_values[data_menu][vk_settings.dropdown_values[data_menu]].text;
	var dropdown_selected = $('<span class="dropdown-selected"></span>');
	dropdown_selected.text(selected_text);
	dropdown_menu.append(dropdown_selected);
	var dropdown_list = $('<div class="dropdown-list"></div>');
	dropdown_menu.append(dropdown_list);
	dropdown_menu.append('<div class="dropdown-arrow"></div>');
	$.each(VK_app.dropdown_values[data_menu], function (index, object) {
		var dropdown_value = index;
		var dropdown_text = object.text;
		var dropdown_option = $('<div class="dropdown-option"></div>');
		dropdown_option.text(dropdown_text);
		dropdown_list.append(dropdown_option);
		dropdown_option.click(function () {
			dropdown_selected.text(dropdown_option.text());
			applySettings('update_dropdown', {
				menu: data_menu,
				value: dropdown_value
			});
		});
	});
	dropdown_menu.click(function () {
		dropdown_list.toggleClass('dropdown-list-active');
	});
}

function renderSwitchers() {
	var switcher_blocks = $('.switcher-block');
	$.each(switcher_blocks, function (index, object) {
		var switcher_block = $(this);
		var data_block = switcher_block.attr('data-block');
		var data_param = switcher_block.attr('data-param');
		var switcher_bool = vk_settings.switchers[data_param];
		if (!switcher_bool) {
			switcher_block.removeClass('switcher-enabled');
			var inner_block = $('.inner-block[data-block=' + data_block + ']');
			inner_block.hide();
		}
		switcher_block.click(function () {
			toggleSwitcher(switcher_block);
		});
	});
}

function toggleSwitcher(switcher_block) {
	var data_block = switcher_block.attr('data-block');
	var data_param = switcher_block.attr('data-param');
	var switcher_bool = !vk_settings.switchers[data_param];
	switcher_block.toggleClass('switcher-enabled');
	var inner_block = $('.inner-block[data-block=' + data_block + ']');
	inner_block.toggle();
	applySettings('update_switcher', {
		name: data_param,
		value: switcher_bool
	});
}

function renderSliders() {
	var sliders = $('.option-slider');
	$.each(sliders, function (index, object) {
		var slider = $(this);
		var data_slider = slider.attr('data-slider');
		var data_param = slider.attr('data-param');
		var slider_value = vk_settings.site[data_slider][data_param];
		slider.val(slider_value);
		slider.change(function () {
			applySettings('update_slider', {
				slider: data_slider,
				param: data_param,
				value: slider.val()
			});
		});
	});
}

function applySortable() {
	var backgrounds_list = $('.backgrounds-block');
	sortable = Sortable.create(backgrounds_list[0], {
		animation: 150,
		draggable: '.background',
		onUpdate: function (e) {
			var temp = vk_settings.backgrounds.array[e.oldIndex];
			vk_settings.backgrounds.array.splice(e.oldIndex, 1);
			vk_settings.backgrounds.array.splice(e.newIndex, 0, temp);
			reindexBackgrounds();
		}
	});
}

function toggleReset() {
	var reset_settings = $('.reset-settings');
	reset_settings.click(function () {
		sendMessage('event_page', {
			act: 'reset_settings'
		});
		sendMessage('content_script', {
			act: 'update_settings'
		});
		setTimeout(function () {
			window.location.reload();
		}, 200);
	});
}

function applySettings(event = 'apply_settings', object) {
	var messagesToSend = [];
	if (event == 'update_color') {
		vk_settings.site[object.name].color = object.value;
	}
	if (event == 'update_slider') {
		vk_settings.site[object.slider][object.param] = object.value;
	}
	if (event == 'update_switcher') {
		vk_settings.switchers[object.name] = object.value;
		if (object.name == 'extension') {
			messagesToSend.push({
				to: 'event_page',
				act: 'toggle_context_menu',
				value: object.value
			});
			if (!vk_settings.switchers.rotation && object.value) {
				object.value = false;
			}
			messagesToSend.push({
				to: 'event_page',
				act: 'toggle_timer',
				value: object.value
			});
		}
		if (object.name == 'rotation') {
			if (!vk_settings.switchers.extension && object.value) {
				object.value = false;
			}
			messagesToSend.push({
				to: 'event_page',
				act: 'toggle_timer',
				value: object.value
			});
		}
	}
	if (event == 'update_dropdown') {
		vk_settings.dropdown_values[object.menu] = object.value;
		if (object.menu == 'time') {
			vk_settings.backgrounds.rotation_time = getCurrentTime() + VK_app.dropdown_values.time[object.value].value;
			messagesToSend.push({
				to: 'event_page',
				act: 'toggle_timer',
				value: true
			});
		}
	}
	getItem('vk_app_settings', function (object) {
		if (event != 'update_current') {
			vk_settings.backgrounds.current = object.vk_app_settings.backgrounds.current;
		}
		setItem('vk_app_settings', vk_settings, function () {
			messagesToSend.push({
				to: 'content_script',
				act: 'update_settings'
			});
			$.each(messagesToSend, function (index, object) {
				sendMessage(object.to, object);
			});
		});
	});
}