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
    console.log(data);
    const pii_parsed = data.proofPresentation.dif.verifiableCredential[0].credentialSubject;
    console.log(pii_parsed);
    acceptPresentation(pii_parsed);
  });

  socket.on('presentation-rejected', (data) => {
    rejectPresentation(data);
  });
}

function acceptPresentation(data) {
  // First, remove all but the background picture from the top part of the page
  const top_left_box = document.getElementById('box1-top');
  const top_right_box = document.getElementById('box2-top');

  top_left_box.remove();
  top_right_box.remove();

  // Next, add account creation message to the top part of the page

  // Main div
  const msg_div = document.createElement('div');
  msg_div.className = 'message_div';

  // The rest
  const checkmark = document.createElement('img');
  checkmark.className = 'checkmark-img';
  checkmark.src = 'images/check_mark.png';

  const congrats_msg = document.createElement('p');
  congrats_msg.className = 'congrats';
  congrats_msg.innerText = 'Congrats!';

  const account_open_msg = document.createElement('p');
  account_open_msg.className = 'account-open';
  account_open_msg.innerText = 'Your account has been opened.';

  const account_number_msg = document.createElement('p');
  account_number_msg.className = 'account-number-msg';
  account_number_msg.innerText = 'Your account number is';

  const account_number = document.createElement('p');
  account_number.className = 'account-number';
  account_number.innerText = '00000573910020';

  const check_email_msg = document.createElement('p');
  check_email_msg.className = 'account-open';
  check_email_msg.innerText = 'Check your email for more details';

  // Append to the top container
  let top_container = document.getElementById('top-container');
  top_container.append(msg_div);

  msg_div.append(checkmark);
  msg_div.append(congrats_msg);
  msg_div.append(account_open_msg);
  msg_div.append(account_number_msg);
  msg_div.append(account_number);
  msg_div.append(check_email_msg);

  // top_container.append(checkmark);
  // top_container.append(congrats_msg);
  // top_container.append(account_open_msg);
  // top_container.append(account_number_msg);
  // top_container.append(account_number);
  // top_container.append(check_email_msg);
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
  const message1 = document.createElement('section');
  message1.className = 'scan-qr-code';
  message1.innerText = 'Please Wait';

  const message2 = document.createElement('p');
  message2.className = 'available-platforms';
  message2.innerText = 'Your information is being processed';

  const wrapper = document.createElement('div');
  wrapper.className = 'loading-wrapper';
  wrapper.innerHTML = await loadAsset('images/spinner.svg');
  
  wrapper.appendChild(message1);
  wrapper.appendChild(message2);

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
