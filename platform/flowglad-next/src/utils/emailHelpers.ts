export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@')
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`
  }
  const visibleChars = Math.min(2, Math.floor(local.length / 3))
  const masked = local.slice(0, visibleChars) + '***' + local.slice(-1)
  return `${masked}@${domain}`
}
