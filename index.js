'use strict'
require('dotenv').config({ silent: true })
const Horseman = require('node-horseman')
var horseman = new Horseman()

horseman
	.open(`https://cloud.collectorz.com/${process.env.CLZ_USER_ID}/comics/export`)
	.waitForSelector('.btn-default')
	// Select all fields
	.click('[data-fields-sortable-move-all]')
	// Sort by date
	.select('[name="export[items-sorting][0][field]"]', 'added')
	.select('[name="export[items-sorting][0][order]"]', 'desc')
	// Secondary sort by issue
	.select('[name="export[items-sorting][1][field]"]', 'issue')
	.select('[name="export[items-sorting][1][order]"]', 'desc')
	.click('[data-export="prepare"]')
	.waitForSelector(`[href="/${process.env.CLZ_USER_ID}/comics/export/download"]`)
	//.click(`[href="/${process.env.CLZ_USER_ID}/comics/export/download"]`)
	.screenshotBase64('JPEG')
	.then(data => {
		const fs = require('fs')
		var buf = new Buffer(data, 'base64');
		fs.writeFile('image.jpg', buf);
	})
	.close()
