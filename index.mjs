import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import { PublicKey } from '@solana/web3.js';
import { randomNumber, totalAmountToBePaid } from './helper.mjs';
import { getWalletBalance, transferSOL } from './solana.mjs';

const getUserPublicKey = async () => {
    const { userPublicKeyInput } = await inquirer.prompt([
        {
            name: 'userPublicKeyInput',
            type: 'input',
            message: 'Please enter your wallet address:',
            validate: input => {
                try {
                    new PublicKey(input);
                    return true;
                } catch (e) {
                    return 'Invalid wallet address. Please enter a valid Solana public key.';
                }
            }
        }
    ]);
    return new PublicKey(userPublicKeyInput);
};

const userPublicKey = await getUserPublicKey();

const init = () => {
    console.log(
        chalk.green(
            figlet.textSync("SOL ROULETTE", {
                font: "Standard",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );

    console.log(chalk.yellow`The max bidding amount is 30 SOL here.`);
};

const askQuestions = async () => {
    const questions = [
        {
            name: 'numbers',
            type: 'checkbox',
            message: 'Which numbers (from 1 to 30) do you want to bet on? You can select up to 5 numbers:',
            choices: Array.from({ length: 30 }, (_, i) => ({ name: (i + 1).toString(), value: i + 1 })),
            validate: value => value.length > 0 && value.length <= 5 ? true : 'Please select up to 5 numbers.'
        },
        {
            name: 'betAmount',
            type: 'number',
            message: 'How much SOL do you want to bet?',
            validate: value => {
                if (isNaN(value) || value <= 0) {
                    return 'Please enter a valid number greater than 0.';
                }
                return true;
            }
        }
    ];
    return inquirer.prompt(questions);
};

const gameExecution = async () => {
    init();

    const { numbers, betAmount } = await askQuestions();
    const totalAmount = totalAmountToBePaid(betAmount);

    console.log(`You need to pay ${chalk.green`${totalAmount}`} SOL to move forward.`);
    
    let userBalance = await getWalletBalance(userPublicKey);

    if (userBalance < totalAmount) {
        const neededAmount = totalAmount - userBalance;
        console.log(chalk.yellow`Your balance is low. You need ${neededAmount} SOL more.`);
        console.log(chalk.green`You can get faucet from https://faucet.solana.com/`);
    } else {
        console.log(chalk.green`You have enough balance to place your bet.`);

        const winningNumber = 8;

        console.log(`The winning number is ${chalk.blue`${winningNumber}`}`);

        if (numbers.includes(winningNumber)) {
            const prizeAmount = betAmount * 5;
            const prizeSignature = await transferSOL(userPublicKey.toBase58(), prizeAmount);

            console.log(chalk.green`Congratulations! You guessed correctly.`);
            console.log(`Here is the prize signatureLink:`, chalk.green`https://solscan.io/tx/${prizeSignature}?cluster=devnet`);
        } else {
            console.log(chalk.yellowBright`Better luck next time. The winning number was ${winningNumber}.`);
        }
    }
};

gameExecution();