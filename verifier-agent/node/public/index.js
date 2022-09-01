'use strict';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function initWebSocket(trackingId) {
  const socket = io('ws://localhost:3000', { transports: ['websocket'] });

  socket.on('connect', () => {
    socket.emit('register-client', trackingId, (response) => {
      console.log(response);
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnected from server');
  });

  socket.on('awaiting-response', () => {
    displaySpinner();
  });

  socket.on('presentation-accepted', (data) => {
    // console.log(data);
    const pii_parsed = data.proofPresentation.dif.verifiableCredential[0].credentialSubject;
    console.log(pii_parsed);
    acceptPresentation(pii_parsed);
  });

  socket.on('presentation-rejected', (data) => {
    rejectPresentation(data);
  });
}


function acceptPresentation(data) {
  const attr_order = ['globalid_id', 'credential_id', 'credential_date_of_issue', 'full_name_legal', 'date_of_birth', 'email', 
  'email_verification_date', 'phone_number', 'phone_number_verification_date', 'address_full', 'ip_address', 
  'id_type', 'id_number'];
  
  var tableElement = document.createElement('table');
  console.log(data);
  var tblBody = document.createElement("tbody");
  for (const attr of attr_order) {
    var row = document.createElement('tr');

    var col1 = document.createElement('td')
    col1.appendChild(document.createTextNode(attr + ': '))
    row.appendChild(col1);

    var col2 = document.createElement('td');
    col2.appendChild(document.createTextNode(data[attr]));
    row.appendChild(col2);

    tblBody.appendChild(row);
  }
  tableElement.appendChild(tblBody);

  setTitle('Congratulations! We have created your account based on the information you just shared with us');
  hideCardSubtitle();
  setMainContent(tableElement, createBackButton());

  hljs.highlightAll();
}

function rejectPresentation(error) {
  const errorIcon = document.createElement('img');
  errorIcon.src = 'images/error-icon.svg';
  errorIcon.className = 'error-icon';

  const errorMessage = document.createElement('p');
  errorMessage.innerText = error.errorMessage;

  const errorCard = document.createElement('div');
  errorCard.className = 'error-message';
  errorCard.appendChild(errorIcon);
  errorCard.appendChild(errorMessage);

  setTitle('Presentation Request Failed');
  hideCardSubtitle();
  setMainContent(errorCard, createBackButton());
}

function createBackButton() {
  const backButton = document.createElement('a');
  backButton.className = 'button';
  backButton.setAttribute('href', '/');
  backButton.innerText = 'Try Again';
  return backButton;
}

async function displaySpinner() {
  const message = document.createElement('p');
  message.className = 'confirm-message';
  message.innerText = 'Confirm this request on your device';

  const wrapper = document.createElement('div');
  wrapper.className = 'loading-wrapper';
  wrapper.innerHTML = await loadAsset('images/spinner.svg');
  wrapper.appendChild(message);

  setMainContent(wrapper);
}

async function loadAsset(fileName) {
  const res = await fetch(fileName);
  return await res.text();
}

function setTitle(text) {
  const heading = document.getElementById('card-title');
  heading.innerText = text;
}

function hideCardSubtitle() {
  const subtitleElement = document.getElementById('card-subtitle');
  subtitleElement.style.display = 'none';
}

function setMainContent(...elements) {
  const mainContainer = document.getElementById('qr-code-container');
  mainContainer.replaceChildren(...elements);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateStyledQrCode(dataUrl) {
  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: dataUrl,
    type: 'svg',
    margin: 0,
    qrOptions: {
      typeNumber: '0',
      mode: 'Byte',
      errorCorrectionLevel: 'M'
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.6,
      margin: 6
    },
    dotsOptions: {
      type: 'dots',
      color: '#000000'
    },
    image: 'images/logo-qr-code.svg',
    cornersSquareOptions: {
      type: 'square',
      color: '#000000'
    },
    cornersDotOptions: {
      type: 'square',
      color: '#000000'
    }
  });

  const message1 = document.createElement('section');
  message1.className = 'scan-qr-code';
  message1.innerText = 'Scan the QR with your mobile device to begin';

  const message2 = document.createElement('p');
  message2.className = 'available-platforms';
  message2.innerText = 'Available on Android & iOS';

  const qrCodeDiv = document.createElement('div');
  qrCodeDiv.className = 'qr-code';

  qrCode.append(qrCodeDiv);
  qrCodeDiv.appendChild(message1);
  qrCodeDiv.appendChild(message2);

  setMainContent(qrCodeDiv);
}
