'use strict';


window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};


function displayMobilePage() {
  // Remove the box containers
  const top_right_box = document.getElementById('box2-top');
  top_right_box.remove();

  const bottom_containers = document.getElementById('bottom-container');
  bottom_containers.remove();

  const top_container = document.getElementById('top-container');
  top_container.style.backgroundImage = 'none';

  const box_1 = document.getElementById('box1-top');
  box_1.style.width = '100%';

  const earn25 = document.getElementById('earn25');
  earn25.style.fontSize = '55px';
  earn25.style.maxWidth = '85%';

  const primary_description = document.getElementById('primary-description');
  // primary_description.style.fontSize = '24px';
  // primary_description.style.maxWidth = '85%';
  primary_description.remove();

  let desktop_notice = document.createElement('section');
  desktop_notice.id = 'desktop-notice';
  desktop_notice.innerHTML = 'Please use a desktop computer to access this page...';
  desktop_notice.style.fontSize = '20px';
  desktop_notice.style.fontFamily = 'Helvetica';
  desktop_notice.style.color = 'white';
  desktop_notice.style.fontWeight = '500';
  desktop_notice.style.lineHeight = '38px';
  desktop_notice.style.maxWidth = '85%';

  let credential_description_box = document.getElementById('credential-description-box');
  credential_description_box.append(desktop_notice);

  const footer = document.getElementById('footer');
  footer.remove();
}


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

  socket.on('invalid-phone-number', (errorInfo) => {
    renderErrorComponents(errorInfo.title, errorInfo.message, errorInfo.isQuestionDisplayed);
  });

  socket.on('something-went-wrong', (errorInfo) => {
    renderErrorComponents(errorInfo.title, errorInfo.message, errorInfo.isQuestionDisplayed);
  });

  socket.on('timeout-error', (errorInfo) => {
    renderErrorComponents(errorInfo.title, errorInfo.message, errorInfo.isQuestionDisplayed);
  });

  socket.on('already-created', (data) => {
    displaySuccessMessage(data['loneStarAccountNumber'], false);
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
  if(window.mobileCheck()) {
    console.log("Mobile device detected");
    displayMobilePage();
    return
  } 

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
