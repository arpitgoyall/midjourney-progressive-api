const { Midjourney } = require("midjourney");
const dotenv = require("dotenv");
dotenv.config();

class MidjourneyClient {
  clients = [];
  curretClientIndex = 0;

  constructor(SalaiTokens) {
    for (const token of SalaiTokens) {
      const client = new Midjourney({
        ServerId: process.env.SERVER_ID,
        ChannelId: process.env.CHANNEL_ID,
        SalaiToken: token,
        HuggingFaceToken: process.env.HUGGING_FACE_TOKEN, // important from preventing ban
        Debug: true,
        Ws: true,
      });
      this.clients.push(client);
    }
  }

  async init() {
    console.log("Connecting to Midjourney clients");
    for (const client of this.clients) {
      await client.init();
    }
  }

  get mjClient() {
    const client = this.clients[this.curretClientIndex];
    this.curretClientIndex = (this.curretClientIndex + 1) % this.clients.length;
    return client;
  }
}

module.exports = MidjourneyClient;
