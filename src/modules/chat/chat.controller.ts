import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
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
    @Req() request: Request
    // @Res() res: Response,
  ){
    // console.log('request',request);
    

    let chatservice  = this.chatservice
    // Checks if this is an event from a page subscription
    if (body.object === 'page') {
        // Iterates over each entry - there may be multiple if batched
        
        body.entry.forEach(function (entry) {
            // Gets the body of the webhook event
            let webhookEvent = entry.messaging[0];
            // Get the sender PSID
            let senderPsid = webhookEvent.sender.id;
            console.log('Sender PSID: ' + senderPsid);
            if (webhookEvent.message) {
              chatservice.callSendAPI(senderPsid, {"text": "hi"});
            }
        });
    }
  }
}

