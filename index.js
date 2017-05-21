'use strict'
// TODO parse file
require('dotenv').config({ silent: true })
const Nightmare = require('nightmare')
require('nightmare-download-manager')(Nightmare)
const nightmare = Nightmare({
	show: true,
	openDevTools: true,
	alwaysOnTop: false,
	paths: {
		downloads: __dirname
	}
})
nightmare.on('download', function(state, downloadItem){
	if(state == 'completed'){
		console.log(downloadItem)
	}
})

nightmare
	.downloadManager()
	.goto(`https://cloud.collectorz.com/${process.env.CLZ_USER_ID}/comics/export`)
	.wait('.btn-default')
	// Select all fields
	.click('[data-fields-sortable-move-all]')
	// Sort by date
	.select('[name="export[items-sorting][0][field]"]', 'added')
	.select('[name="export[items-sorting][0][order]"]', 'desc')
	// Secondary sort by issue
	.select('[name="export[items-sorting][1][field]"]', 'issue')
	.select('[name="export[items-sorting][1][order]"]', 'desc')
	// Create file
	.click('[data-export="prepare"]')
	.wait(`[href="/${process.env.CLZ_USER_ID}/comics/export/download"]`)
	// Download file
	.evaluate(function(selector){
		var el = document.querySelector(selector)
		el.removeAttribute('target')
	}, `[href="/${process.env.CLZ_USER_ID}/comics/export/download"]`)
	.click(`[href="/${process.env.CLZ_USER_ID}/comics/export/download"]`)
	.waitDownloadsComplete()
	.end()
	.then(console.log)
	.catch(console.error)
