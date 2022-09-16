'use strict';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function initWebSocket(url, trackingId) {
  const socket = io(url, { transports: ['websocket'] });

  socket.on('connect', () => {
    socket.emit('register-client', trackingId, (response) => {
      console.log(response);
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnected from server');
  });

  socket.on('awaiting-response', () => {
    console.log("I am getting da spinner!!")
    displaySpinner();
  });

  socket.on('presentation-accepted', (data) => {
    // console.log(data);
    // renderErrorComponents('THis is the title', 'This is the message part ususally a bit longer', true);
    displaySuccessMessage(data['loneStarAccountNumber'], false);
  });

  socket.on('presentation-rejected', (errorInfo) => {
    // rejectPresentation(errorInfo);
    renderErrorComponents(errorInfo.title, errorInfo.message, errorInfo.isQuestionDisplayed);
  });

  socket.on('invalid-id-type', (errorInfo) => {
    renderErrorComponents(errorInfo.title, errorInfo.message, errorInfo.isQuestionDisplayed);
  });

  socket.on('something-went-wrong', (errorInfo) => {
    renderErrorComponents(errorInfo.title, errorInfo.message, errorInfo.isQuestionDisplayed);
  });

  socket.on('timeout-error', (errorInfo) => {
    renderErrorComponents(errorInfo.title, errorInfo.message, errorInfo.isQuestionDisplayed);
  });

  socket.on('already-created', (data) => {
    displaySuccessMessage(data['loneStarAccountNumber'], true);
  });
}

function removeTopComponents() {
  const top_left_box = document.getElementById('box1-top');
  const top_right_box = document.getElementById('box2-top');

  top_left_box.remove();
  top_right_box.remove();
}

function displaySuccessMessage(accountNumber, accountExists) {
  removeTopComponents();

    // Main div
    const msg_div = document.createElement('div');
    msg_div.className = 'message_div';
  
    // The rest
    const checkmark = document.createElement('img');
    checkmark.className = 'checkmark-img';
    checkmark.src = 'images/check_mark.png';

    const congrats_msg = document.createElement('p');
    congrats_msg.className = 'congrats';
    congrats_msg.innerText = accountExists ? "Yay" : 'Congrats!';

    const account_open_msg = document.createElement('p');
    account_open_msg.className = 'account-open';
    account_open_msg.innerText = accountExists ? 'Looks like you already have an account with us' : 'Your account has been opened';

    const account_number_msg = document.createElement('p');
    account_number_msg.className = 'account-number-msg';
    account_number_msg.innerText = accountExists ? 'Please contact Lone Star' : 'Your account number is';

    const account_number = document.createElement('p');
    account_number.className = 'account-number';
    account_number.innerText = accountNumber;

    // Append to the top container
    let top_container = document.getElementById('top-container');
    top_container.append(msg_div);

    msg_div.append(checkmark);
    msg_div.append(congrats_msg);
    msg_div.append(account_open_msg);
    msg_div.append(account_number_msg);
    msg_div.append(account_number);

    if(!accountExists) {
      const check_email_msg = document.createElement('p');
      check_email_msg.className = 'account-open';
      check_email_msg.innerText = 'Check your email for more details';
      msg_div.append(check_email_msg);
    }
}

function renderErrorComponents(title, message, isError) {
  const qrCode = document.createElement('div');

  const qrImg = document.createElement("img");
  qrImg.src = isError ? 'images/qr_error.svg' : 'images/qr_question.svg';
  qrImg.width = '225';

  const tryAgainButton = createBackButton();

  const qrCodeDiv = document.createElement('div');
  qrCodeDiv.className = 'qr-code';

  qrCode.append(qrCodeDiv);
  qrCodeDiv.appendChild(qrImg);

  const qrCodeContainer = document.getElementById('qr-code-container');
  
  const messageDiv = createMessageArea(title, message, 'message-text-section');
  messageDiv.appendChild(tryAgainButton)

  setMainContent(qrCodeDiv);
  qrCodeContainer.appendChild(messageDiv);
}

function createBackButton() {
  const backButton = document.createElement('a');
  backButton.className = 'back-button';
  backButton.setAttribute('href', '/');
  backButton.innerText = 'Try Again';
  return backButton;
}

async function displaySpinner() {

  const wrapper = document.createElement('div');
  wrapper.className = 'loading-wrapper';
  wrapper.innerHTML = await loadAsset('images/spinner.svg');

  const messageDiv = createMessageArea('Please Wait', 'Your information is being processed', 'message-text-section');

  const qrCodeContainer = document.getElementById('qr-code-container');


  setMainContent(wrapper);
  qrCodeContainer.appendChild(messageDiv);
}

async function loadAsset(fileName) {
  const res = await fetch(fileName);
  return await res.text();
}


function setMainContent(...elements) {
  const mainContainer = document.getElementById('qr-code-container');
  mainContainer.replaceChildren(...elements);
}

function createMessageArea(title, message, messageClass) {
  const message1 = document.createElement('section');
  message1.className = 'qr-text-title';
  
  message1.innerText = title;

  const message2 = document.createElement('p');
  message2.className = messageClass;
  message2.innerText = message;

  const messageDiv = document.createElement('div');
  messageDiv.className = 'message-area';
  messageDiv.appendChild(message1);
  messageDiv.appendChild(message2);
  return messageDiv;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateStyledQrCode(dataUrl) {
  const qrCode = new QRCodeStyling({
    width: 250,
    height: 250,
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

  const messageSection = document.createElement('div');
  messageSection.className = ('message-section');

  const qrCodeDiv = document.createElement('div');
  qrCodeDiv.className = 'qr-code';

  const qrCodeContainer = document.getElementById('qr-code-container');
  const message1 = 'Scan the QR with your mobile device to begin';
  const message2 = 'Available on Android & iOS';
  const messageDiv = createMessageArea(message1, message2, 'available-platforms');

  qrCode.append(qrCodeDiv);

  setMainContent(qrCodeDiv);
  qrCodeContainer.appendChild(messageDiv);
}
