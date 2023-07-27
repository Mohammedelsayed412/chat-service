import  {Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map, tap } from 'rxjs';
import express, {Request, Response} from 'express';
import { createCipheriv, randomBytes, scrypt, createHmac } from 'crypto';
import { promisify } from 'util';

const request = require('request')


@Injectable()
export class ChatService {
  private logger = new Logger(ChatService.name);

  constructor(private readonly http: HttpService) {}
    async callSendAPI(senderPsid, response) {
      // The page access token we have generated in your app settings
      const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  
      // Construct the message body
      let requestBody = {
          "recipient": {
              "id": senderPsid
          },
          "message": response
      };
      // Send the HTTP request to the Messenger Platform
      request({
        'uri': 'https://graph.facebook.com/v2.6/me/messages',
        'qs': { 'access_token': PAGE_ACCESS_TOKEN },
        'method': 'POST',
        'json': requestBody
      }, (err, _res, _body) => {
        if (!err) {
            console.log('Message sent!');
        } else {
            console.error('Unable to send message:' + err);
        }
      });
      // ? Why not working ...?
    // this.http.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, requestBody)
      
  }

// ? What is buf ???
  async verifyRequestSignature(req, buf) {
    var signature = req.headers["x-hub-signature-256"];
    if (!signature) {
      console.warn(`Couldn't find "x-hub-signature-256" in headers.`);
    } else {
      var elements = signature.split("=");
      var signatureHash = elements[1];
      var expectedHash = createHmac("sha256", process.env.APP_SECRET).update(buf).digest("hex");
      
      if (signatureHash != expectedHash) {
        throw new Error("Couldn't validate the request signature.");
      }
    }
  }
}
