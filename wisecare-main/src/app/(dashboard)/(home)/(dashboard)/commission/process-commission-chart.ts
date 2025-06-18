const processChartData = (
  data:
    | { commission_earned: number; or_date: string | null | undefined }[]
    | null
    | undefined,
): { month: string; commission_earned: number }[] => {
  if (!data) {
    return []
  }

  const result: { month: string; commission_earned: number }[] = []
  const currentDate = new Date()
  const startMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 11,
    1,
  )

  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(
      startMonth.getFullYear(),
      startMonth.getMonth() + i,
      1,
    )
    const monthString = monthDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    })

    const filteredData = data.filter((item) => {
      if (!item.or_date) return false
      const itemDate = new Date(item.or_date)
      return (
        itemDate.getFullYear() === monthDate.getFullYear() &&
        itemDate.getMonth() === monthDate.getMonth()
      )
    })

    const totalCommission = filteredData.reduce(
      (sum, item) => sum + item.commission_earned,
      0,
    )

    result.push({ month: monthString, commission_earned: totalCommission })
  }

  return result
}

export default processChartData
