const express = require("express");
const app = express();
const { imagine, shorten, custom, describe } = require("./routes");
const MidjourneyClient = require("./MidjourneyClient");
const PORT = process.env.PORT || 3700;
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());

console.log(
  "Runtime environment is " + (process.env.NODE_ENV || "development")
);

const client = new MidjourneyClient(process.env.SALAI_TOKENS.split(" "));
client.init();

app.set("client", client);

app.use("/api", imagine);
app.use("/api", shorten);
app.use("/api", describe);
app.use("/api", custom);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
