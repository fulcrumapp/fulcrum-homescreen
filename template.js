window.AppTemplate = "<html>\n<head>\n  <title>__TITLE__</title>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" />\n  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n  <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\">\n  <link rel=\"apple-touch-icon-precomposed\" href=\"__ICON__\">\n</head>\n<body>\n  <style type=\"text/css\">\n  body, html {\n    margin: 0;\n    padding: 0;\n  }\n  img {\n    position: absolute;\n    width: 250px;\n    height: 250px;\n    left: 50%;\n    top: 50%;\n    margin-left: -125px;\n    margin-top: -125px;\n    border-radius: 30px;\n  }\n  #desc {\n    font-family: Sans-Serif;\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    text-align: center;\n    color: #444;\n  }\n  </style>\n  <a id=\"link\" href=\"__URL__\" style=\"display:none\"></a>\n  <img src=\"__ICON__\" />\n  <p style=\"display:none;\" id=\"desc\">Add this URL to your homescreen.</p>\n  </div>\n  <script type=\"text/javascript\">\n  if (window.navigator.standalone) {\n    var link = document.getElementById('link');\n    var ev = document.createEvent('MouseEvents');\n    ev.initEvent('click', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);\n    setTimeout(function() { link.dispatchEvent(ev); }, 100);\n  } else {\n    document.getElementById('desc').style.display = '';\n  }\n  </script>\n</body>\n</html>\n";