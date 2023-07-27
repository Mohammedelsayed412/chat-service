import  {ForbiddenException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { createHmac } from 'crypto';
const request = require('request')


@Injectable()
export class ChatService {
  
  constructor() {}
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
    console.log('in');
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      data: requestBody
    }).catch(() => {
      throw new ForbiddenException('Faild to call meta graph');
    });
  }

  async verifyRequestSignature(req, buf) {
    var signature = req.headers["x-hub-signature-256"];
    if (!signature) {
      console.warn(`Couldn't find "x-hub-signature-256" in headers.`);
      return false
    } else {
      var elements = signature.split("=");
      var signatureHash = elements[1];
      var expectedHash = createHmac("sha256", process.env.APP_SECRET).update(buf).digest("hex");
      if (signatureHash != expectedHash) {
        return false
      }
      else{
        return true
      }
    }
  }
}
