const core = require('./core');
var client = null;

function filterPhoneNumber(phoneNumber){
  var mobile = '';

        if(phoneNumber.charAt(0) == '+'){
            mobile = "62" + phoneNumber.replace(/[^a-zA-Z0-9+]/g, "").substr(3);
        } else if(phoneNumber.charAt(0) == '0'){
                mobile = "62" + phoneNumber.replace(/[^a-zA-Z0-9+]/g, "").substr(1);
        } else if(phoneNumber.charAt(0) == '8'){
                mobile = "62" + phoneNumber.replace(/[^a-zA-Z0-9+]/g, "").substr(0);
        }
        else {
            mobile = phoneNumber.replace(/[^a-zA-Z0-9]/g, "");
        }
  return mobile
}


exports.init = async() => {
  if (!client) {
    client = await core.init(`wa-bot`)
    client.onStateChange((state) => {
      // force whatsapp take over
      if ('CONFLICT'.includes(state)) client.useHere();
      // detect disconnect on whatsapp
      if ('UNPAIRED'.includes(state)) console.log('logout');
    });
    
  }
};

exports.sendMessage = async(to,msg) => {
  if (to && msg) {
    var phoneNumber = filterPhoneNumber(to.toString())
    var data = client.sendText(`${phoneNumber}@c.us`, msg)
    .then((result) => {
      return result
    })
    .catch((erro) => {
      return erro
    });

    return Promise.resolve(data);
  }
}

exports.sendMessageWithImage = async(to,base,msg) => {
  if (to && base && msg) {
    var phoneNumber = filterPhoneNumber(to.toString())
    var data = client.sendImageFromBase64(`${phoneNumber}@c.us`, base, 'Image')
    .then((result) => {
      return result
    })
    .catch((erro) => {
      return erro
    });

    client.sendText(`${phoneNumber}@c.us`, msg).then((result) => {
      console.log(1)
    })
    .catch((erro) => {
      console.log(0)
    });

    return Promise.resolve(data);
  }
}

exports.sendGroupMessage = async(to,msg,groupId) => {
  if (to && msg && groupId) {
    var phoneNumber = filterPhoneNumber(to.toString())
    var data = client.sendText(`${phoneNumber}-${groupId}@g.us`, msg)
    .then((result) => {
      return result
    })
    .catch((erro) => {
      return erro
    });

    return Promise.resolve(data);
  }
}

exports.getGroupInfo = async(link) => {
  if (link) {
    var data = client.getGroupInfoFromInviteLink(link)
    .then((result) => {
      return result
    })
    .catch((erro) => {
      return erro
    });

    return Promise.resolve(data);
  }
}

exports.logout = () => client.logout();
exports.getConnectionState = () => client?.getConnectionState();
exports.getHostDevice = () => client?.getHostDevice();