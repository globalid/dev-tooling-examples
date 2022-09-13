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
    // Parse out just the PII
    const pii_parsed = data.proofPresentation.dif.verifiableCredential[0].credentialSubject;
    const account_number = data.loneStarAccountNumber;
    acceptPresentation(pii_parsed, account_number);
  });

  socket.on('presentation-rejected', (data) => {
    rejectPresentation(data);
  });
}


function acceptPresentation(data, account_number) {
  // List of credentials that should be included. Using instead of iterating through the keys, because 
  // iterating through keys doesn't maintain order
  const attr_order = ['globalid_id', 'credential_id', 'credential_date_of_issue', 'full_legal_name', 'date_of_birth', 'email_address', 
  'email_verification_date', 'phone_number', 'phone_number_verification_date', 'full_residence_address', 'ip_address', 
  'id_type', 'id_number'];

  // Create table that displays the data
  var tableElement = document.createElement('table');
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

  if(!account_number || account_number != "0000000000") {
    setTitle('Congratulations! We have created your account based on the information you just shared with us. Your account number is ' + account_number);
  } else {
    setTitle('Your information was either formatted incorrectly or already exists. Please call');
  }
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
  const mainContainer = document.getElementById('main-container');
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

  const qrCodeDiv = document.createElement('div');
  qrCode.append(qrCodeDiv);
  setMainContent(qrCodeDiv);
}
