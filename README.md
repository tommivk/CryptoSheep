# CryptoSheep
## App

The app is available at:

https://cryptosheep.netlify.app/

NFTs on opensea testnet:

https://testnets.opensea.io/collection/cryptosheep-v2

## Contract

#### Install dependencies
```
npm install
```
#### Run tests

```
npx hardhat test --network localhost
```
#### Compile contracts

```
npx hardhat compile
```

### Deploying contracts to localhost
#### Start local node
```
npx hardhat node
```
#### Deploy contracts
```
npm run deploy
```
### Deploying contracts to Goerli testnet
#### Deploy contracts
```
npx hardhat run scripts/deploy.ts --network goerli
```

## Frontend
#### Install dependencies
```
npm install
```

#### Start in development mode
```
npm run dev
```

#### Build 
```
npm run build
```
