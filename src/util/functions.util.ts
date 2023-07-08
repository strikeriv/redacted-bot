export function runAtTime (targetTime: string, callback: () => any): any {
  const [timeStr, meridiem] = targetTime.split(' ')
  const [hourStr, minuteStr] = timeStr.split(':')
  let hour = Number(hourStr)
  const minute = Number(minuteStr)

  if (meridiem === 'PM' && hour !== 12) {
    hour += 12
  } else if (meridiem === 'AM' && hour === 12) {
    hour = 0
  }

  const now = new Date()
  const targetDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute
  )

  if (targetDate < now) {
    targetDate.setDate(targetDate.getDate() + 1)
  }

  const timeDiff = targetDate.getTime() - now.getTime()

  setTimeout(() => {
    callback()
    setInterval(callback, 24 * 60 * 60 * 1000) // run the callback every 24 hours
  }, timeDiff)
}
