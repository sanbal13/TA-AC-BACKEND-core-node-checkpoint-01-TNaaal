let http = require('http');
let fs = require('fs');
let qs = require('querystring');
let url = require('url');


let contactPath = __dirname + '/contacts/';

let PORT = 5000;

let server = http.createServer(handleRequest);

function handleRequest(req, res) {
  let store = '';
  req.on('data', (chunk) => {
    store += chunk;
  });

  req.on('end', () => {
     let parsedUrl = url.parse(req.url, true);
    if (req.method === 'GET' && req.url === '/') {
        // Display index Page
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('./index.html').pipe(res);
    } else if (req.method === 'GET' && req.url === '/about') {
        // Display About Page
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('./about.html').pipe(res);
    } else if (req.method === 'GET' && req.url === '/contact') {
        // Display Contact Form
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('./contact.html').pipe(res);
    } else if (req.method === 'POST' && req.url === '/form') {
        // Processing the Form
      let parsedData = qs.parse(store);
      let jsonData = JSON.stringify(parsedData);
      fs.open(contactPath + parsedData.username + '.json', 'wx', (err, fd) => {
        if (err) return res.end('Username Taken');
        fs.write(fd, jsonData, (err) => {
          if (err) return console.log(err);
          fs.close(fd, (err) => {
            if (err) console.log(err);
            res.end('Contacts Saved');
          });
        });
      });
    } else if(req.method === 'GET' && req.url === '/users') {
        // Display all the users
        
       res.setHeader = ('Content-Type', 'application/json')
       
       fs.readdir(contactPath, (err, files) => {
           if(err) return console.log(err);
           files.forEach((file) => {
               console.log(file);
               fs.readFile(contactPath + file, (err, content) => {
                   if(err) return console.log(err);
                   res.write(content);                   
               })
            });          
       });
       setTimeout(() => res.end('Data Fetched'), 50);
                
    } else if(req.method === 'GET' && parsedUrl.pathname === '/users'){
           // Displaying details of a user
           let username = parsedUrl.query.username;     
           res.setHeader ('Content-Type', 'application/json');
           fs.readFile(contactPath + username + '.json', (err, content) => {
               if(err) res.end("User does not exist");              
                res.end(content);
           })
    } else if (req.url.split('.').pop() === 'css') {
        // Handling CSS Files
      res.setHeader('Content-Type', 'text/css');
      fs.readFile('.' + req.url, (err, content) => {
        if (err) return console.log(err);
        res.end(content);
      });
    } else if (req.url.split('.').pop() === 'jpg') {
        //Handling Image Files
      res.setHeader('Content-Type', 'image');
      fs.readFile('.' + req.url, (err, content) => {
        if (err) return console.log(err);
        res.end(content);
      });
    } else {
      res.setCode = 404;
      res.end('Page not found');
    }
  });
}

server.listen(PORT, () => {
  console.log('server is listening on port ' + PORT);
});
