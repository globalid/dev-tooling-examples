"use strict";

const SocketEvent = {
  AwaitingResponse: 'awaiting-response',
  ClientRegistered: 'client-registered',
  ClientUnregistered: 'client-unregistered',
  Error: 'error',
  PresentationAccepted: 'presentation-accepted',
  PresentationRejected: 'presentation-rejected',
  RegisterClient: 'register-client'
}

/**
 * This method gets called in `index.hbs` and the trackingId gets injected in
 * @param {string} trackingId the tracking id for this client
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function webSocketHandler(trackingId) {
  const socket = new WebSocket("ws://localhost:8080");

  registerEventListeners(socket, onopen, onmessage, onerror, onclose)

  /**
   * This event gets fired when the websocket connection get's established
   * @param {object} event - a event object passed in by the websocket layer
   */
  function onopen(/* event */) {
    // send the initial event to the server to register this client
    sendWsEvent(socket, SocketEvent.RegisterClient, { trackingId })
  };

  /**
   * This event gets fired when a message is received on the websocket connection
   * @param {object} event - the websocket event object sent in by the websocket framework
   * @param {object} event.data - the object sent from the server (stringified JSON)
   */
  function onmessage(event) {
    const data = JSON.parse(event.data)

    // route based on our application event
    switch (data.event) {
      case SocketEvent.AwaitingResponse:
        console.log('awaiting response')
        break

      case SocketEvent.ClientRegistered:
        console.log('client was successfully registered')
        break

      case SocketEvent.PresentationAccepted:
        console.log('presetation-accepted', data.data);
        break

      case SocketEvent.PresentationRejected:
        console.log('presentation rejected')
        break

      case SocketEvent.ClientUnregistered:
        console.log('client unregistered')
        break

      case SocketEvent.Error:
        console.error(`got an error: ${data}`)
        break

      default:
        console.warn(`found event of type ${data.event}. No listener registered.`)
    }
  };

  /**
   * This method gets called when a connection error happens to the websocket connection,
   * not when a server error or exception happens
   * @param {object} event - the websocket event object sent in by the websocket framework
   */
  function onerror(/* event */) {
    console.log('onerror');
  }

  /**
   * This method gets called when the connection has been closed
   * @param {object} event - the websocket event object sent in by the websocket framework
   */
  function onclose(/* event */) {
    console.log('onclose');
  }
}

/**
 * 
 * @param {WebSocket} socket the WebSocket instance
 * @param {string} event the application level event to send to the server
 * @param {any} data the data payload to send to the server
 */
function sendWsEvent(socket, event, data) {
  socket.send( JSON.stringify({ event, data }) );
}

function registerEventListeners(socket, onopen, onmessage, onerror, onclose) {
  socket.onopen = onopen;
  socket.onmessage = onmessage;
  socket.onerror = onerror;
  socket.onclose = onclose
}
