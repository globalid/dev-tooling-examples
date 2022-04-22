// Create WebSocket connection.
const trackingId = '96f5ad768582857b';
const socket = new WebSocket("ws://localhost:8080");

// attach event listeners
socket.onopen = onopen;
socket.onmessage = onmessage;
socket.onerror = onerror;
socket.onclose = onclose;

function documentWrite(s) {
  document.write(s);
}

function onopen(event) {
  console.log('onopen called');
  console.log(event);

  socket.send(
    JSON.stringify({
      event: "register-client",
      data: { trackingId },
    })
  );
};

function onmessage(event) {
  console.log('onmessage');
  // console.log(event);

  const data = JSON.parse(event.data)

  // route based on our application event (sent over websockets)
  switch (data.event) {
    case 'client-registered':
      // scan QR code
      // Calls to EPam and stuffs
      var fooDom = document.getElementById("foo");
      var text = document.createTextNode("This just got added ");
      fooDom.appendChild(text);
      console.log('client registered')
      var data1 = document.createTextNode(data.event);
      fooDom.appendChild(data1);
      break

    case 'presentation-accepted':
      // TODO THis is where things return when accepted
      console.log('presentation accepted')
      break

    case 'presentation-rejected':
      // TODO this is where we reject
      console.log('presentation rejected')
      break

    case 'client-unregistered':
      console.log('client unregistered')
      break

    case 'error':
      console.log(`got an error: ${event.data}`)
      break

    default:
      console.warn(`found event of type ${data.event}. No listener registered.`)
  }
};

function onerror(event) {
  console.log('onerror');
  console.log(event);
}

function onclose(event) {
  console.log('onclose');
  console.log(event);
}