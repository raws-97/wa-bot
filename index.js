require('dotenv').config();
const express = require('express');
const app = express();
const whatsapp = require('./whatsapp/index');
var port = process.env.PORT || 3000

whatsapp.init();

app.set('view engine', 'ejs');
app.use(express.json({limit: '50mb'}));
app.use(express.static('public'));
// Whatsapp
app.post('/whatsapp/send/text', async(req, res) => {
  var {to, msg} = req.body;
  var data = await whatsapp.sendMessage(to, msg);

  res.status(200).json({
    erro : data.erro,
    response: data.status})

});

app.post('/whatsapp/send/image', async(req, res) => {
  var {to, base, msg} = req.body;
  var data = await whatsapp.sendMessageWithImage(to, base, msg);
  res.status(200).json({
    erro : data.erro,
    response: data.status})
});

app.post('/whatsapp/send/group', async(req, res) => {
  var {to, msg, groupId} = req.body;
  var data = await whatsapp.sendGroupMessage(to, msg, groupId);
  
  res.status(200).json({
    erro : data.erro,
    response: data.status})

});

app.post('/whatsapp/info/group', async(req, res) => {
  var {link} = req.body;
  var data = await whatsapp.getGroupInfo(link);

  res.status(200).json({
    id : data.id.user,
    name: data.subject})

});

app.post('/whatsapp/logout', async(req, res) => {
  whatsapp.logout();
  res.redirect('/whatsapp');
});

app.post('/whatsapp/restart-service', async(req, res) => {
  await whatsapp.init();
  res.redirect('/whatsapp');
});

app.get('/whatsapp', async(req, res) => {
  const state = await whatsapp.getConnectionState();
  const deviceInfo = await whatsapp.getHostDevice();
  res.render('whatsapp/index',{state,deviceInfo});
});

app.listen(port, function(){
  console.log('Listening on port : '+ port);
})