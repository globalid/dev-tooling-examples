/**
 * Generates and appends to the dom a styled QR code
 * @param {string} dataURL the url to encode into the QR code
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateStyledQRCode(dataURL, elmID) {
  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: dataURL,
    type: 'svg',
    margin: 0,
    qrOptions: {
      typeNumber: "0",
      mode: "Byte",
      errorCorrectionLevel: "M"
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.6,
      margin: 6
    },
    dotsOptions: {
      type: "dots",
      color: "#000000"
    },
    image: "GiD.svg",
    cornersSquareOptions: {
      type: "square",
      color: "#000000"
    },
    cornersDotOptions: {
      type: "square",
      color: "#000000"
    }
  });

  qrCode.append(document.getElementById(elmID));
}
