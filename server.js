var http = require('http');
var url = require('url');
var validUrl = require('valid-url');
var data = [];
var counter = 0;

function handleRequest(port) {
  http.createServer(function(request, response) {
    if (request.method != 'POST') {
      var object = url.parse(request.url, true)
      object.path = object.path.slice(1);
      if (object.path.slice(0, 3) === 'new') {
        object.path = object.path.slice(4);
        if (validUrl.isUri(object.path)) {
          var found = false;
          for (var i = 0; i < data.length; i++) {
            if (data[i].original_url == object.path) {
              found = true;
              response.end(JSON.stringify(data[i]));
            }
          }

          if (found == false) {
            var jo = {};
            jo.original_url = object.path;
            jo.new_url = 'https://url-shortener-danevandy99.c9users.io/' + counter;
            counter += 1;
            data.push(jo);
            response.end(JSON.stringify(jo));
          }

        }
        else {
          response.end('Not a Valid URL');
        }
      }
      else if (object.path.length == 1) {
        if (data[parseInt(object.path)] != undefined) {
          response.writeHead(302, {
            'Location': data[parseInt(object.path)].original_url
          });
          response.end();
        }
        else {
          response.end('Invalid Link');
        }
      } else {
        response.end('To create a new link go to https://url-shortener-danevandy99.c9users.io/new/your_link_here')
      }

    }

  }).listen(port)
  console.log('Server listening on port ' + port);
}

handleRequest(8080)
