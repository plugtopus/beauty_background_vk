var VK_app = {
	info: {
		extension_id: chrome.runtime.id,
		current_version: parseFloat(chrome.runtime.getManifest().version)
	},
	dropdown_values: {
		time: {
			'min5': {
				text: '5 минут',
				value: 300
			},
			'min10': {
				text: '10 минут',
				value: 600
			},
			'min30': {
				text: '30 минут',
				value: 1800
			},
			'hour1': {
				text: '1 час',
				value: 3600
			},
			'hour6': {
				text: '6 часов',
				value: 21600
			},
			'day1': {
				text: '1 день',
				value: 86400
			}
		},
		order: {
			'asc': {
				text: 'по порядку',
				value: 'asc'
			},
			'random': {
				text: 'случайно',
				value: 'random'
			}
		},
		position: {
			'fixed': {
				text: 'фиксированный',
				value: 'fixed'
			},
			'initial': {
				text: 'прокручиваемый',
				value: 'initial'
			}
		}
	},
	block_values: {
		'background-rotate': 'en_background_rotate',
		'page-opacity': 'en_page_opacity',
		'page-stroke': 'en_page_stroke',
		'ex-enabled': 'en_extension'
	}
}