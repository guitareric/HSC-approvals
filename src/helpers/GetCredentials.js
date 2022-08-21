const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 30 })
  const page = await browser.newPage()

  await page.goto('https://resource.cores.utah.edu/auth/login')
  console.log('Logging in...')
  await page.type('[name="username"]', 'u0480789')
  console.log('name typed')
  await page.type('[name="password"]', 'Amelia_jane1')
  console.log('pass typed')
  await page.click('#content > form > button')
  console.log('button clicked')
  await page.waitForNavigation()
  await page.goto('https://resource.cores.utah.edu/#/manage/approval/13')
  await page.waitForNavigation()
  let results = await page.$eval('table tbody', tbody => [...tbody.rows].map(r => [...r.cells].map(c => c.innerText)))

  console.log(results)
})()

// node fetch
// fetch("https://resource.cores.utah.edu/orders/pending/13", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InUwNDgwNzg5IiwiaWF0IjoxNjYxMTIwMTM1LCJleHAiOjE2NjExNjMzMzV9.lip6_JZAjs8cK7Y9e0xmxFA4B7DbIeFWXVywCilQX0k",
//     "if-none-match": "W/\"7eaa1-wxmHTAjHYTtfeQqOZQW4MGWoXVc\"",
//     "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"104\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "sentry-trace": "dc42f3da6ba140cab5ce34c56df06c95-9a0e6993fe32fe7e-0",
//     "cookie": "_ga_8DN5TEP3ML=GS1.1.1654001556.1.0.1654001560.0; _ga=GA1.2.1399463177.1640131894; _ga_C0YTJ3KHXC=GS1.1.1660519303.1.0.1660519306.0",
//     "Referer": "https://resource.cores.utah.edu/",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": null,
//   "method": "GET"
// });

async function gotoExtended(page, request) {
  const { url, method, headers, postData } = request

  if (method !== 'GET' || postData || headers) {
    let wasCalled = false
    await page.setRequestInterception(true)
    const interceptRequestHandler = async request => {
      try {
        if (wasCalled) {
          return await request.continue()
        }

        wasCalled = true
        const requestParams = {}

        if (method !== 'GET') requestParams.method = method
        if (postData) requestParams.postData = postData
        if (headers) requestParams.headers = headers
        await request.continue(requestParams)
        await page.setRequestInterception(false)
      } catch (error) {
        log.debug('Error while request interception', { error })
      }
    }

    await page.on('request', interceptRequestHandler)
  }

  return page.goto(url)
}

// const GetCredentials = async () => {
//   try {
//     const browser = await puppeteer.launch({ headless: false, slowMo: 100 })
//     const page = await browser.newPage()
//     await page.goto('https://resource.cores.utah.edu/auth/login')
//     console.log('Logging in...')
//     await page.type('[name="username"]', 'u0480789')
//     console.log('name typed')
//     await page.type('[name="password"]', 'Amelia_jane1')
//     console.log('pass typed')
//     await page.click('#content > form > button')
//     console.log('button clicked')
//     await page.waitForNavigation()
//     await page.goto('https://resource.cores.utah.edu/orders/pending/13')
//     await page.waitForNavigation()
//   } catch (error) {
//     console.log('error in Login')
//   }
// }

// module.exports = { GetCredentials: GetCredentials }
