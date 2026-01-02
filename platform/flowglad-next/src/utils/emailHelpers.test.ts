import { describe, expect, it } from 'vitest'
import { maskEmail } from './emailHelpers'

describe('maskEmail', () => {
  it('should mask short email addresses correctly', () => {
    // Email with 2 or fewer characters before @
    expect(maskEmail('a@domain.com')).toBe('a***@domain.com')
    expect(maskEmail('ab@domain.com')).toBe('a***@domain.com')
  })

  it('should mask normal email addresses correctly', () => {
    // Email like "john@example.com"
    expect(maskEmail('john@example.com')).toBe('j***n@example.com')
    expect(maskEmail('jane@example.com')).toBe('j***e@example.com')
    expect(maskEmail('robert@example.com')).toBe('ro***t@example.com')
  })

  it('should handle edge cases', () => {
    // Very long local part
    expect(maskEmail('verylongemailaddress@example.com')).toBe(
      've***s@example.com'
    )

    // Special characters in local part
    expect(maskEmail('john.doe@example.com')).toBe('jo***e@example.com')
    expect(maskEmail('user+tag@example.com')).toBe('us***g@example.com')

    // Numbers in local part
    expect(maskEmail('user123@example.com')).toBe('us***3@example.com')

    // Single character local part (edge case)
    expect(maskEmail('x@domain.com')).toBe('x***@domain.com')

    // Three character local part
    expect(maskEmail('abc@domain.com')).toBe('a***c@domain.com')
  })
})
