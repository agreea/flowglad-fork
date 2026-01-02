import { describe, expect, it } from 'vitest'
import { maskEmail } from './emailHelpers'

describe('maskEmail', () => {
  it('should mask short email addresses correctly', () => {
    // email with 2 or fewer characters before @
    expect(maskEmail('a@domain.com')).toBe('a***@domain.com')
    expect(maskEmail('ab@domain.com')).toBe('a***@domain.com')
  })

  it('should mask normal email addresses correctly', () => {
    // email like "john@example.com"
    expect(maskEmail('john@example.com')).toBe('j***n@example.com')
    expect(maskEmail('jane@example.com')).toBe('j***e@example.com')
    expect(maskEmail('test@example.com')).toBe('t***t@example.com')
  })

  it('should handle edge cases', () => {
    // very long local part
    expect(maskEmail('verylongemail@example.com')).toBe(
      've***l@example.com'
    )

    // special characters in local part
    expect(maskEmail('user.name@example.com')).toBe('us***e@example.com')
    expect(maskEmail('user+tag@example.com')).toBe('us***g@example.com')

    // single character local part
    expect(maskEmail('x@example.com')).toBe('x***@example.com')

    // three character local part
    expect(maskEmail('abc@example.com')).toBe('a***c@example.com')

    // numeric local part
    expect(maskEmail('12345@example.com')).toBe('1***5@example.com')
  })
})
