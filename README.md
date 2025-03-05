# Web3 Todo App

A decentralized todo application built with Next.js, Tailwind CSS, TypeScript, and Solidity.

## Features

- User-friendly interface for managing to-do items.
- Decentralized storage of to-do items on the blockchain.
- Responsive design using Tailwind CSS.

## Technologies Used

- **Next.js**: A React framework for server-side rendering.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **TypeScript**: A typed superset of JavaScript for better development experience.
- **Solidity**: The programming language for writing smart contracts.
- **Ethers.js**: A library for interacting with the Ethereum blockchain.
- **Hardhat**: A development environment for compiling, deploying, testing, and debugging Ethereum software. It allows for easy local blockchain simulation and deployment to test networks.

## Prerequisites

- Node.js (version X.X.X)
- npm (version X.X.X)
- MetaMask or another Ethereum wallet

## Setup, Compilation, and Deployment

1. Install dependencies:

   ```bash
   npm install
   ```

2. Compile the smart contracts:

   ```bash
   npx hardhat compile
   ```

3. Deploy the smart contract:

   - **Using the Ignition Module**:
   - Ensure you have the Ignition module installed and configured.
   - Deploy the smart contract using:

   ```bash
   npx hardhat ignition deploy
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Usage

- Connect your Ethereum wallet (e.g., MetaMask) to interact with the application.
- Add, complete, and delete to-do items.

## Testing

To run tests for the smart contracts, use the following command:

```bash
npx hardhat test
```

## Troubleshooting

- If you encounter issues, ensure that your Hardhat node is running and that your wallet is connected to the correct network.
- Check the console for any error messages and refer to the documentation for troubleshooting tips.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please reach out to [marctonimas@protonmail.com].
