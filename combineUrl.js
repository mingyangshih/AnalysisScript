import {loadFile} from './loadFile.js'
import xlsx from 'xlsx'

let pageViewSheet = loadFile('./10_24_pageview.xlsx', 1);
let adRequestSheet = loadFile('./10_24_ad_request.xlsx', 1);
let adRequestSheetSet = new Set()
let pageNoRequest = []


// Deal with pageView Data================

// const newPageViewSheet = xlsx.utils.json_to_sheet(pageViewSheet.workbook_response)
// xlsx.utils.book_append_sheet(pageViewSheet.workbook, newPageViewSheet, 'Sheet 2');
// xlsx.writeFile(pageViewSheet.workbook, './10_24_pageview.xlsx');

// Deal with Video Request Data============
adRequestSheet.workbook_response.forEach(i => {
    adRequestSheetSet.add(i['Fullpath'])
})
pageViewSheet.workbook_response.forEach(i => {
    if(!adRequestSheetSet.has(i.Fullpath)) {
        pageNoRequest.push(i.Fullpath)
    }
})
let pageNoRequestSet = new Set([...pageNoRequest])
pageNoRequest = []
pageNoRequestSet.forEach(i => {
    console.log(i)
    pageNoRequest.push({Fullpath : i})
})
// const newPageViewSheet = xlsx.utils.json_to_sheet(pageNoRequest)
// xlsx.utils.book_append_sheet(pageViewSheet.workbook, newPageViewSheet, 'Sheet 3', true);
// xlsx.writeFile(pageViewSheet.workbook, './10_24_pageview.xlsx');


// Deal with Video Request Data============
// adRequestSheet.workbook_response.forEach(i => {
//     i.Fullpath = `${i.Hostname}${i.Page}`
// })
// const newAdRequestSheet = xlsx.utils.json_to_sheet(adRequestSheet.workbook_response)
// xlsx.utils.book_append_sheet(adRequestSheet.workbook, newAdRequestSheet, 'Sheet 2');
// xlsx.writeFile(adRequestSheet.workbook, './10_24_ad_request.xlsx');