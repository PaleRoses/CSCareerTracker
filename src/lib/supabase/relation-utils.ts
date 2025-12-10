export function getPrimaryRelation<T>(
  relation: T[] | T | null | undefined
): T | null {
  if (!relation) return null
  if (Array.isArray(relation)) {
    return relation[0] ?? null
  }
  return relation
}

export function extractFromRelation<T, R>(
  relation: T[] | T | null | undefined,
  accessor: (item: T) => R | undefined | null,
  fallback: R
): R {
  const primary = getPrimaryRelation(relation)
  if (!primary) return fallback

  const value = accessor(primary)
  return value ?? fallback
}

export function hasRelation<T>(
  relation: T[] | null | undefined
): relation is [T, ...T[]] {
  return Array.isArray(relation) && relation.length > 0
}
