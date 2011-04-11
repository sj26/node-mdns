dgram  = require "dgram"
ndns = require "ndns"
sys = require "sys"
util = require "util"

{Buffer} = require "buffer"
{EventEmitter} = require "events"

module.exports = class mDNSResponder extends EventEmitter
  constructor: (requestListener) ->
    if requestListener
      @on "request", requestListener

  start: ->
    @socket = dgram.createSocket "udp4"
    
    @socket.on "listening", -> @emit "listening"
    @socket.on "message", @message
    @socket.on "close", -> @emit "close"

    # Listen to mDNS
    @socket.bind 5353, "224.0.0.251"
  
  message: (buffer, sender) ->
    request = new ndns.ServerRequest @socket, sender
    if request.parseOnce buffer
      response = new ndns.ServerResponse request
      @emit "request", request, response
  
  stop: ->
    @socket.close
