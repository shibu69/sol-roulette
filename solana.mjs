import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl, sendAndConfirmTransaction, Transaction, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';

dotenv.config();

const keyPair = Keypair.fromSecretKey(bs58.decode(process.env.SECRET_KEY));

export const getWalletBalance = async (pubk) => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const balance = await connection.getBalance(pubk);
        return balance / LAMPORTS_PER_SOL;
    } catch (err) {
        console.error("Error fetching wallet balance:", err);
        throw err; // Rethrow or handle appropriately
    }
};

export const transferSOL = async (to, transferAmnt) => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: keyPair.publicKey,
                toPubkey: new PublicKey(to),
                lamports: transferAmnt * LAMPORTS_PER_SOL
            })
        );

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [keyPair]
        );

        return signature;
    } catch (err) {
        console.error('Error transferring SOL:', err.message);
        console.error('Stack Trace:', err.stack);
        throw err; // Rethrow or handle appropriately
    }
};