'use strict';

const renderHtml = (data) => {
  return `
<html>
  <head>
    <style>
      body {
        padding: 20px;
        background-color: #ffffff;
      }
      pre {
        background-color: #777777;
        color: #ffffff;
        padding: 20px;
        border-radius: 10px;
      }
    </style>
  </head>
  <body>
    <pre>
      ${JSON.stringify(data, null, 2)}
    </pre>
  </body>
</html>
`.trim();
};

module.exports = {
  renderHtml,
};
