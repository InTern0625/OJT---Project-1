const countHmo = (
  data: { hmo_provider: { name: string } | null }[] | null | undefined,
): { hmo_provider: string; count: number; percentage: number }[] => {
  if (!data) return []

  const total = data.length
  const hmoCountMap: { [key: string]: number } = {}

  // Count occurrences of each hmo_provider
  data.forEach((item) => {
    const providerName = item.hmo_provider?.name
    if (providerName) {
      hmoCountMap[providerName] = (hmoCountMap[providerName] || 0) + 1
    }
  })

  // Convert the count map to the desired output format
  return Object.entries(hmoCountMap).map(([hmo_provider, count]) => ({
    hmo_provider,
    count,
    percentage: (count / total) * 100,
  }))
}

export default countHmo
