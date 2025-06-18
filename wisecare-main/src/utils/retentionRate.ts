// Define the type for the data
interface AccountStatusChange {
  account_id: string
  is_account_active: boolean
  changed_at: string
}

export function calculateRetentionRate(
  data: AccountStatusChange[],
  periodStart: Date,
  periodEnd: Date,
): number {
  if (!data) {
    return 0
  }

  // Get the latest status change before the periodStart for each account
  const latestStatusBeforePeriodStart = data.reduce<
    Record<string, AccountStatusChange>
  >((acc, change) => {
    if (
      new Date(change.changed_at) <= periodStart &&
      (!acc[change.account_id] ||
        new Date(acc[change.account_id].changed_at) <
          new Date(change.changed_at))
    ) {
      acc[change.account_id] = change
    }
    return acc
  }, {})

  // Clients who were active at the start of the period
  const activeClientsAtStart = Object.values(
    latestStatusBeforePeriodStart,
  ).filter((change) => change.is_account_active).length

  // Get the latest status change up to the periodEnd for each account
  const latestStatusUpToPeriodEnd = data.reduce<
    Record<string, AccountStatusChange>
  >((acc, change) => {
    if (
      new Date(change.changed_at) <= periodEnd &&
      (!acc[change.account_id] ||
        new Date(acc[change.account_id].changed_at) <
          new Date(change.changed_at))
    ) {
      acc[change.account_id] = change
    }
    return acc
  }, {})

  // Clients who were active at the start and remained active at the end of the period
  const retainedClients = Object.keys(latestStatusBeforePeriodStart).filter(
    (accountId) => {
      const startStatus = latestStatusBeforePeriodStart[accountId]
      const endStatus = latestStatusUpToPeriodEnd[accountId]
      return startStatus?.is_account_active && endStatus?.is_account_active
    },
  ).length

  // Retention Rate Calculation
  const retentionRate =
    activeClientsAtStart > 0
      ? (retainedClients / activeClientsAtStart) * 100
      : 0 // Handle division by zero

  return Math.round(retentionRate) // Returns as a rounded number
}
