const get = require('simple-get-promise').get

const now = new Date()
const month = parseInt(('0' + (now.getMonth() + 1)).slice(-2))

const end = `${now.getFullYear()}-0${month + 1}-01`
const start = `${now.getFullYear()}-0${month}-01`
const london = 'ag1zfmd3ZWItY2FtcHVzciILEgZDYW1wdXMiBFJvb3QMCxIGQ2FtcHVzIgZsb25kb24M'

const url = `https://www.campus.co/api/campuses/${london}/events/?format=json&start=${start}&end=${end}`

const toEvent = ({_key, url='', name, description, location, start, end} = {}) => `
BEGIN:VEVENT
UID:${_key}
URL:${url}
DTSTART:${start.replace(/[-:]/g, '')}
DTEND:${end.replace(/[-:]/g, '')}
SUMMARY:${name}
DESCRIPTION:${url} ${description.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ')}
LOCATION:${location}
END:VEVENT
`

get(url)
  //=> `)]}',\n{...}`
  .then(res => Promise.resolve(JSON.parse(res.responseText.split('\n')[1])))
  .then(res => res.objects.map(toEvent))
  .then(events => `BEGIN:VCALENDAR\nVERSION:1.0\n${events.join('')}\nEND:VCALENDAR`)
  .then(res => console.log(res))
  .catch(res => console.error(res))
