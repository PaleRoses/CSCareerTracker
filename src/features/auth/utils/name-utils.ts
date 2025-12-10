interface SplitNameResult {
  fname: string
  lname: string
}

export function splitFullName(
  fullName?: string | null,
  defaultFname = 'User',
  defaultLname = ''
): SplitNameResult {
  const parts = fullName?.split(' ') || []
  return {
    fname: parts[0] || defaultFname,
    lname: parts.slice(1).join(' ') || defaultLname,
  }
}
