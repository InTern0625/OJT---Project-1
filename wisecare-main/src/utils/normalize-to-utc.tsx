const normalizeToUTC = (date: Date): Date => {
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  )
  return utcDate
}

export default normalizeToUTC
