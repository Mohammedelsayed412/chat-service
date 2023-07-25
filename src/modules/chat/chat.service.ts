import  {Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map, tap } from 'rxjs';
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
}
