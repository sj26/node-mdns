(function() {
  var Buffer, EventEmitter, dgram, mDNSResponder, ndns, sys, util;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  dgram = require("dgram");
  ndns = require("ndns");
  sys = require("sys");
  util = require("util");
  Buffer = require("buffer").Buffer;
  EventEmitter = require("events").EventEmitter;
  module.exports = mDNSResponder = (function() {
    __extends(mDNSResponder, EventEmitter);
    function mDNSResponder(requestListener) {
      if (requestListener) {
        this.on("request", requestListener);
      }
    }
    mDNSResponder.prototype.start = function() {
      this.socket = dgram.createSocket("udp4");
      this.socket.on("listening", function() {
        return this.emit("listening");
      });
      this.socket.on("message", this.message);
      this.socket.on("close", function() {
        return this.emit("close");
      });
      return this.socket.bind(5353, "224.0.0.251");
    };
    mDNSResponder.prototype.message = function(buffer, sender) {
      var message;
      message = new ndns.ServerRequest(this.socket, sender);
      message.parseOnce(buffer);
      return this.emit("request", message);
    };
    mDNSResponder.prototype.stop = function() {
      return this.socket.close;
    };
    return mDNSResponder;
  })();
}).call(this);
