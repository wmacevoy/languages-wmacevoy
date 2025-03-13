module.exports = {
    reporters: [
      'default',
      [ 'jest-html-reporter', {
        outputPath: 'tests/report.html',  // Specify the output file path
        pageTitle: 'Test Report',                // Title for the HTML page
        // You can add more options here for customization
      } ]
    ]
  };