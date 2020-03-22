import express from "express";
import path from 'path';
import React from "react";
import { renderToString } from "react-dom/server";
import App from "../src/App";
import fs from "fs";

const app = express();

app.get("/api/hello", (req, res) => {
  res.send({ greeting: "Hello!" });
});

app.get( "/*", ( req, res ) => {
  const context = { };
  const jsx = (
    <App context={ context } location={ req.url } />
  );
  const reactDom = renderToString( jsx );

  fs.readFile(path.resolve('./build/index.html'), 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Some error occurred");
    }

    res.writeHead( 200, { "Content-Type": "text/html" } );

    // res.end( htmlTemplate( reactDom ) );

    return res.end(data.replace('<div id="root"></div>', `<div id="root">${reactDom}</div>`))
  });

} );

app.use( express.static( path.resolve( __dirname, "..", "build" ) ) );

const port = 2048;
app.listen( port, ()=>{ console.log(`The server is up on port ${ port }!`); } );

