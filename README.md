# dCertify
## Introduction
DCertify is a decentralized application that allow institutions to create and issue certifications to students. Storing data in a blockchain is expensive so DCertify store institutions and certifications info in IPFS and link these file by using the hashes.
DCertify identifies the role associated to an Ethereum address and display custom pages based on this role.
DCertify uses Metamask to send and sign transactions.

## Roles
There are three different roles with different permissions and capabilities:
- Admins:
    - can add other admins
    - can add institutions 
    - can update cost of issuing a certification
- Institutions:
    - can add certifications
    - can issue certifications to students
    - can view their certifications
- Students:
    - can view the list of certifications they have received
    - can decide whether they want to make their certifications public or not

## Setup
Setting up DCertify is pretty simple. This project has been created with Truffle. Please follow the following instructions to run DCertify:
1. clone the repository to your local machine:
git clone ...
and install node modules:
npm install
2. Edit your truffle.js (or truffle-config.js) file with your network settings. You may need to edit the IP and port where your Ethereum client is running.
3. Compile and migrate your contracts from within your project folder:
truffle compile
truffle migrate
Note: keep in mind that the account[0] will be associated an Admin role. You can run the tests for the smart contracts by running:
truffle test
4. Install and configure Metamask to point to your network. You will need at least 3 different accounts to fully test all functionality (admin, institution and student).
5. Start your application:
npm run start
6. In your web browser go to localhost:3000.