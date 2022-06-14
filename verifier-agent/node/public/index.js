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
    acceptPresentation(data);
  });

  socket.on('presentation-rejected', (data) => {
    rejectPresentation(data);
  });
}

function acceptPresentation(data) {
  const codeElement = document.createElement('code');
  codeElement.className = 'language-json';
  codeElement.innerHTML = JSON.stringify(data, null, 2);

  const preElement = document.createElement('pre');
  preElement.style.marginBottom = '1.5rem';
  preElement.style.maxWidth = '69rem';
  preElement.style.textAlign = 'left';
  preElement.appendChild(codeElement);

  setTitle('Verifiable Presentation Received');
  hideCardSubtitle();
  setMainContent(preElement, createBackButton());

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
  backButton.innerText = 'Back';
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
