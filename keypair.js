import dotenv from "dotenv";
dotenv.config();
import bs58 from "bs58";

const keyPair = {
    publicKey : bs58.decode(process.env.publicKey),
    secretKey : bs58.decode(process.env.secretKey)
}

console.log(keyPair);