"use strict";

const SocketEvent = {
  AwaitingResponse: 'awaiting-response',
  ClientRegistered: 'client-registered',
  ClientUnregistered: 'client-unregistered',
  Error: 'error',
  PresentationAccepted: 'presentation-accepted',
  PresentationRejected: 'presentation-rejected',
  RegisterClient: 'register-client',
  UnregisterClient: 'unregister-client',
}

/**
 * This method gets called in `index.hbs` and the trackingId gets injected in
 * @param {string} trackingId the tracking id for this client
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function webSocketHandler(trackingId) {
  const socket = new WebSocket("ws://localhost:8080");

  registerEventListeners(socket, onopen, onmessage, onerror, onclose, trackingId)

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
        swapOutQrCodeWithLoadingConfirm()
        break

      case SocketEvent.ClientRegistered:
        console.log(`client was successfully registered with trackingId: ${trackingId}`)
        break

      case SocketEvent.PresentationAccepted:
        acceptPresentationResponse(data.data)
        break

      case SocketEvent.PresentationRejected:
        rejectPresentationData(data.data)
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
 * This function swaps out the loading svg with the code block for presentation request data
 * @param {object} data the presentation request data from epam
 */
function acceptPresentationResponse(data) {
  // create json code area
  const codeCard = document.createElement('pre')
  codeCard.setAttribute('id', 'json')
  codeCard.classList.add('message')
  codeCard.classList.add('code')
  codeCard.innerText = JSON.stringify(JSON.parse(data), null, 2)

  replaceMainContentWith(codeCard)
  appendBackButtonTo('main-container')

  swapHeadingTextWith('Verifiable Presentation Received')
  swapSubHeadingWith('')
}

/**
 * This function swaps out the loading svg with the error message UI block
 * @param {string} errorMessage an error message
 */
function rejectPresentationData(errorMessage) {
  // create the error text area
  const errorCard = document.createElement('div')
  errorCard.classList.add('message')
  errorCard.classList.add('error')

  // load up the error icon
  const errIcon = document.createElement('img')
  errIcon.setAttribute('src', 'error-icon.svg')
  errIcon.classList.add('error-icon')
  errorCard.appendChild(errIcon)

  // error message text
  const errMsg = document.createElement('p')
  errMsg.innerText = JSON.parse(errorMessage)
  errorCard.appendChild(errMsg)

  replaceMainContentWith(errorCard)
  appendBackButtonTo('main-container')

  swapHeadingTextWith('Presentation Request Failed')
  swapSubHeadingWith('')
}

/**
 * Creates an html button and adds it to the provided containerid's container
 * @param {string} containerId to add button to
 */
function appendBackButtonTo(containerId) {
  const backbtn = document.createElement('a')
  backbtn.classList.add('button')
  backbtn.setAttribute('href', '/')
  backbtn.innerText = 'Back'
  document.getElementById(containerId).appendChild(backbtn)
}

/**
 * This function swaps out the QR code with the loading svg
 */
async function swapOutQrCodeWithLoadingConfirm() {
  const wrapper = document.createElement('div')
  wrapper.id = 'loading-asset'
  wrapper.classList.add('loading-wrapper')

  const msg = document.createElement('p')
  msg.classList.add('confirm-msg')
  msg.innerText = 'Confirm this request on your device'

  const loadingSvg = await loadAsset('loading.svg')
  wrapper.innerHTML = loadingSvg
  wrapper.appendChild(msg)

  replaceMainContentWith(wrapper)
}

/**
 * Loads and returns the assets raw text
 * @param {string} fileName of asset to load
 */
async function loadAsset(fileName) {
  const res = await fetch(fileName)
  return await res.text()
}

/**
 * Replaces the heading with the provided text
 * @param {string} text to display
 */
function swapHeadingTextWith(text) {
  const heading = document.getElementById('card-title')
  heading.innerText = text
}

/**
 * Replaces the sub-heading with the provided text.
 * Optionally removes the subheading if text is falsey
 * @param {string} text to display
 */
function swapSubHeadingWith(text) {
  if (!text) {
    const subHeading = document.getElementById('sub-heading')
    subHeading.parentNode.removeChild(subHeading)
    return
  }

  const subHeading = document.getElementById('sub-heading')
  subHeading.innerText = text
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

/**
 * Registers websocket event listeners
 * @param {WebSocket} socket WebSocket object
 * @param {Function} onopen 
 * @param {Function} onmessage 
 * @param {Function} onerror 
 * @param {Function} onclose 
 * @param {Function} trackingId 
 */
function registerEventListeners(socket, onopen, onmessage, onerror, onclose, trackingId) {
  socket.onopen = onopen;
  socket.onmessage = onmessage;
  socket.onerror = onerror;
  socket.onclose = onclose;

  window.addEventListener("beforeunload", function() {
    sendWsEvent(socket, SocketEvent.UnregisterClient, { trackingId });
  })
}

/**
 * Removes the main containers content with the provided element
 * @param {HTMLElement} element the element to put in the main container
 */
function replaceMainContentWith(element) {
  const mainContainer = document.getElementById('main-container')
  mainContainer.replaceChildren(element)
}
