import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, RawBodyRequest, Req, Res } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import express, {Request, Response} from 'express';
import { ChatService } from './chat.service';


@Controller('chats')
@ApiTags('chats')
export class ChatController {
  constructor(private chatservice: ChatService) {}
  
  @ApiResponse({ type: String })
  @Get('/webhook')
  @ApiQuery({ name: 'hub.mode', required: false })
  @ApiQuery({ name: 'hub.verify_token', required: false })
  @ApiQuery({ name: 'hub.challenge', required: false })
  getChats(
    @Res() res: Response,
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') verify_token: string,
    @Query('hub.challenge') challenge: string,
  ){
    // Your verify token. Should be a random string.    
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    
    // Checks if a token and mode is in the query string of the request
    if (mode && verify_token) {
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && verify_token === VERIFY_TOKEN) {
          // Responds with the challenge token from the request
          console.log('WEBHOOK_VERIFIED');
          res.status(200).send(challenge);
      } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          res.status(403).send();
      }
    }
    res.status(404).send();
  }


  // @ApiResponse({ type: String })
  @Post('/webhook')
  postChats(
    @Body() body: any,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ){    
    let chatservice  = this.chatservice
    // Checks if this is an event from a page subscription
    if (body.object === 'page') {
      res.status(200).send();
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function (entry) {          
        // Gets the body of the webhook event
        let webhookEvent = entry.messaging[0];
        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id;
        console.log('Sender PSID: ' + senderPsid);
        // check if webhookEvent is not echo from our response to user
        if (webhookEvent.message && !webhookEvent.message.is_echo) {       
            // Validate payload signature
            if(chatservice.verifyRequestSignature(req, req.rawBody))  {
              chatservice.callSendAPI(senderPsid, {"text": "hi"});
            }
          }
        });
    }
  }
}

