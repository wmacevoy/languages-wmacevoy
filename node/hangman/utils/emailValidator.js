
 // Construct a regex for validating Unicode email addresses
const emailRegex = new RegExp(
    // Negative lookahead: disallow consecutive dots anywhere in the email
    '^(?!.*\\.{2})' +
    // Local part (username): one or more allowed chars, with dots allowed in between segments
    '(?<localPart>[\\p{L}0-9!#$%&\'*+\\/=?^_`{|}~-]+' +
      '(?:\\.[\\p{L}0-9!#$%&\'*+\\/=?^_`{|}~-]+)*)' +
    // '@' symbol separates local part and domain part
    '@' +
    // Domain name: one or more labels separated by dots (excluding the TLD here)
    '(?<domainName>' +
      // First domain label: starts/ends with letter or digit, allows hyphens inside, up to 63 chars
      '[\\p{L}0-9](?:[\\p{L}0-9-]{0,61}[\\p{L}0-9])?' +
      // Additional labels (optional): same pattern, prefixed by a dot
      '(?:\\.[\\p{L}0-9](?:[\\p{L}0-9-]{0,61}[\\p{L}0-9])?)*' +
    ')' +
    // Literal dot before the top-level domain
    '\\.' +
    // Top-level domain: at least 2 Unicode letters
    '(?<tld>[\\p{L}]{2,})' +
    // End of string anchor
    '$',
    'u'  // 'u' flag for Unicode support (needed for \p{L} and to enable named groups)
  );
  
/**
 * Checks if the given email is valid.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if valid, false otherwise.
 */
function isEmailValid(email) {
  return emailRegex.test(email);
}

// Export the function for use in production and testing
module.exports = { isEmailValid };