const { isEmailValid } = require("../utils/emailValidator");

// Improved tests for email validation
// These tests group email cases into Valid Emails and Invalid Emails,
// and include additional edge cases like Unicode emails, edge cases for dot positions,
// and non-string inputs.

describe("Email Validation Tests", () => {
  describe("Valid Emails", () => {
    const validEmails = [
      // Basic valid cases
      ["easy@example.com", true],
      ["user22@numbers.net", true],
      ["user+spam@filter.net", true],
      ["a@b.co", true],
      ["a_1@www.example-site.biz", true],
      
      // Unicode email addresses
      ["δοκιμή@παράδειγμα.δοκιμή", true],
      ["用户@例子.广告", true],
      ["пример@пример.рф", true],
      
      // Display name format (if intended to be accepted by the validator)
      ["Alice Wonder <alice@wonderland.book>", true]
    ];

    test.each(validEmails)("isEmailValid('%s') should return true", (email, expected) => {
      expect(isEmailValid(email)).toBe(expected);
    });
  });

  describe("Invalid Emails", () => {
    const invalidEmails = [
      // Basic invalid cases
      ["", false],
      ["@", false],
      [null, false],
      [42, false],
      [false, false],
      ["user@", false],
      ["@example.com", false],
      
      // Medium cases
      ["at@at@at.at", false],
      ["user++spam@filter.net", true],
      ["c++@lang.io", true],
      
      // Edge cases for dot positions and consecutive dots
      [".john@example.com", false],            // Leading dot in local part
      ["john.@example.com", false],            // Trailing dot in local part
      ["john..doe@example.com", false],          // Consecutive dots in local part
      ["john.doe@example..com", false],          // Consecutive dots in domain
      ["john.doe@.example.com", false],          // Domain label starting with a dot
      ["john.doe@example.c", false],             // TLD too short (less than 2 letters)
      ["john.doe@example.123", false],           // TLD must consist of letters
      
      // Non-string inputs
      [undefined, false],
      [{}, false],
      [[], false]
    ];

    test.each(invalidEmails)("isEmailValid('%s') should return false", (email, expected) => {
      expect(isEmailValid(email)).toBe(expected);
    });
  });
});