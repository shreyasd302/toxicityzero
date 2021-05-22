const config = require('./config.js');
const Discord = require('discord.js');
const client = new Discord.Client();
require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
const threshold = 0.9;
let model;
client.on('ready', async () => {
    model = await toxicity.load(threshold);
  console.log(`Logged in as ${client.user.tag}!`);
});
var cnt = 0;
client.on('message', async msg => {
  if (msg.author.bot) 
      return;
  let text = msg.content;
  let predictions = await model.classify(text);
  predictions.forEach(prediction => {

      if (prediction.results[0].match) {
          if (cnt <= 5){
            msg.reply('Warning! toxicity found in your earlier message. Please delete.');
            cnt = cnt+1;
            msg.reply('current server toxicity count is: ');
            msg.reply(cnt);
          }
        else if (cnt > 5){
            msg.delete({ reason: 'message is deleted as toxicity count exceeded the limit.'});
            msg.reply('message is deleted as toxicity count exceeded than the limit.')
        }
    }
    });
});
client.login(config.TOKEN);