var VK_defaults = {
	switchers: {
		extension: true,
		rotation: true,
		stroke: true,
		opacity: true,
		ads: true
	},
	backgrounds: {
		current: 0,
		rotation_time: getCurrentTime() + VK_app.dropdown_values.time['min10'].value,
		array: [
		{
			url: chrome.extension.getURL('/images/backgrounds/ye.jpg')
		},
		{
			url: chrome.extension.getURL('/images/backgrounds/art.jpg')
		},
		{
			url: chrome.extension.getURL('/images/backgrounds/rain.jpg')
		}
		]
	},
	site: {
		stroke: {
			size: 0,
			opacity: 70,
			blur: 80,
			color: {r: 0, g: 0, b: 0}
		},
		page: {
			opacity: 95,
			color: {r: 255, g: 255, b: 255}
		}
	},
	dropdown_values: {
		time: 'min10',
		order: 'asc'
	}
}