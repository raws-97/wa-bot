const fs = require('fs');
const venom = require('venom-bot');
exports.init = async(sessionName = 'default-session') =>{
  return await venom.create(
    sessionName,
    exportQR,
    (statusSession, session) => {
      console.log('Status Session: ', statusSession);
      //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
      //Create session wss return "serverClose" case server for close
      console.log('Session name: ', session);

      if (statusSession == 'autocloseCalled') {
        if (fs.existsSync('public/images/qrCode.png')) {
          fs.unlinkSync('public/images/qrCode.png');
        }
      }
    },
    {
      folderNameToken: 'tokens', //folder name when saving tokens
      mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
      headless: true, // Headless chrome
      devtools: false, // Open devtools by default
      useChrome: true, // If false will use Chromium instance
      debug: false, // Opens a debug session
      logQR: false, // Logs QR automatically in terminal
      browserWS: '', // If u want to use browserWSEndpoint
      browserArgs: [''], // Parameters to be added into the chrome browser instance
      puppeteerOptions: {args: ['--no-sandbox', '--disable-setuid-sandbox']}, // Will be passed to puppeteer.launch
      disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
      disableWelcome: true, // Will disable the welcoming message which appears in the beginning
      updatesLog: true, // Logs info updates automatically in terminal
      // autoClose: false, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
      createPathFileToken: false, //creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
    }
  );
}
const exportQR = (base64Qrimg, asciiQR, attempts, urlCode) => {
  // console.log('Number of attempts to read the qrcode: ', attempts);
  // console.log('Terminal qrcode: ', asciiQR);
  // console.log('base64 image string qrcode: ', base64Qrimg);
  // console.log('urlCode (data-ref): ', urlCode);
  var matches = base64Qrimg.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }
  response.type = matches[1];
  response.data = new Buffer.from(matches[2], 'base64');

  var imageBuffer = response;
  if (!fs.existsSync('public/images')){
    fs.mkdirSync('public/images',{recursive:true});
  }
  fs.writeFile(
    'public/images/qrCode.png',
    imageBuffer['data'],
    'binary',
    function (err) {
      if (err != null) {
        console.log(err);
      }
    }
  );
}
