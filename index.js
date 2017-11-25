const get = require('simple-get-promise').get
const html2plaintext = require('html2plaintext')
const { format, addMonths } = require('date-fns')

const iso = 'YYYY-MM-DD'
const now = new Date()
const lastMonth = addMonths(now, -1)
const nextMonth = addMonths(now, 1)
const start = format(lastMonth, iso)
const end = format(nextMonth, iso)

const url = `https://www.campus.co/api/campuses/london/events/?format=json&start=${start}&end=${end}`

const toEvent = ({_key, url, name, description, location, start, end} = {}) => `
BEGIN:VEVENT
UID:${_key}
URL:${url ? url : ''}
DTSTAMP:${start.replace(/[-:]/g, '')}
DTSTART:${start.replace(/[-:]/g, '')}
DTEND:${end.replace(/[-:]/g, '')}
SUMMARY:${name}
DESCRIPTION:${url ? url + ' - ' : ''}${html2plaintext(description).replace(/\n/g, ' ').replace(/\s+/g, ' ')}
LOCATION:${location}
END:VEVENT
`

get(url)
  //=> `)]}',\n{...}`
  .then(res => Promise.resolve(JSON.parse(res.responseText.split('\n')[1])))
  .then(res => res.objects.map(toEvent))
  .then(events => `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//tlvince//campus-london-ical//EN
${events.join('')}
END:VCALENDAR
`)
  .then(res => console.log(res))
  .catch(res => console.error(res))
