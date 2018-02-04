const get = require('simple-get-promise').get
const html2plaintext = require('html2plaintext')
const { format, addMonths } = require('date-fns')

const iso = 'YYYY-MM-DD'
const now = new Date()
const lastMonth = addMonths(now, -1)
const nextMonth = addMonths(now, 1)
const start = format(lastMonth, iso)
const end = format(nextMonth, iso)

const url = `https://www.campus.co/api/campuses/london/events/v2?format=json&start=${start}&end=${end}`

const toEvent = ({
  url = 'https://www.campus.co/london/en/events',
  _key,
  name,
  local_end_str,
  local_start_str,
  description_preview
} = {}) => `
BEGIN:VEVENT
UID:${_key}
URL:${url}/${_key}
DTSTAMP:${local_start_str.replace(/[-:]/g, '')}
DTSTART:${local_start_str.replace(/[-:]/g, '')}
DTEND:${local_end_str.replace(/[-:]/g, '')}
SUMMARY:${name}
DESCRIPTION:${url}/${_key} - ${html2plaintext(description_preview).replace(/\n/g, ' ').replace(/\s+/g, ' ')}
LOCATION:Campus London
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
