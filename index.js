const fs = require("fs");

fs.readFile("log.txt", (err, data) => {
  if (err) {
      console.log("error")
  }
  for(let b = data.slice(0, data.indexOf("\n")), rest = data.slice(data.indexOf("\n")); b.length > 0 ;b = rest.slice(0,rest.indexOf("\n")), rest = rest.slice(rest.indexOf("\n"))){
      console.log(b)
  }
});
