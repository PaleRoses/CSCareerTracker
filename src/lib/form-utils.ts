export function getFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  field: string
): string | undefined {
  return fieldErrors?.[field]?.[0]
}

export function hasFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  field: string
): boolean {
  return !!fieldErrors?.[field]?.length
}

export function getFieldErrorProps(
  fieldErrors: Record<string, string[]> | undefined,
  field: string
): { error: boolean; errorMessage: string | undefined } {
  const errorMessage = getFieldError(fieldErrors, field)
  return { error: !!errorMessage, errorMessage }
}
