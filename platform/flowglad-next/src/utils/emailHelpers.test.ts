import { describe, expect, it } from 'vitest'
import { maskEmail } from '@/utils/emailHelpers'

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
  })

  it('should handle edge cases', () => {
    // very long local part
    expect(maskEmail('verylongemailaddress@example.com')).toBe(
      've***s@example.com'
    )

    // special characters in local part
    expect(maskEmail('john.doe@example.com')).toBe('jo***e@example.com')
    expect(maskEmail('user+tag@example.com')).toBe('us***g@example.com')

    // numbers in local part
    expect(maskEmail('user123@example.com')).toBe('us***3@example.com')

    // different domain formats
    expect(maskEmail('test@subdomain.domain.co.uk')).toBe(
      't***t@subdomain.domain.co.uk'
    )
  })
})
