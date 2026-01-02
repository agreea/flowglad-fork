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
    expect(maskEmail('alice@test.io')).toBe('a***e@test.io')
  })

  it('should handle edge cases', () => {
    // very long local part
    expect(maskEmail('verylongemailaddress@example.com')).toBe(
      've***s@example.com'
    )

    // special characters
    expect(maskEmail('john.doe@example.com')).toBe('jo***e@example.com')
    expect(maskEmail('user+tag@example.com')).toBe('us***g@example.com')
    expect(maskEmail('test_user@example.com')).toBe('te***r@example.com')

    // numeric local part
    expect(maskEmail('12345@example.com')).toBe('1***5@example.com')

    // three character local part (boundary case)
    expect(maskEmail('abc@example.com')).toBe('a***c@example.com')
  })
})
