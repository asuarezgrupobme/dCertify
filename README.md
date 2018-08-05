# dCertify
## Introduction
DCertify is a decentralized application that allow institutions to create and issue certifications to students. Storing data in a blockchain is expensive so DCertify store institutions and certifications info in IPFS and link these files by using the IPFS hashes.

DCertify identifies the role associated to the Ethereum address selected in Metamask and display custom pages based on this role.

DCertify uses Metamask to send and sign transactions and detect automatically account changes (different roles).

## Roles
There are three different roles with different permissions and capabilities:
- Admins:
    - Can add other admins
    - Can add institutions 
    - Can update cost of issuing a certification
- Institutions:
    - Can add certifications
    - Can view their certifications
    - Can issue certifications to students
- Students:
    - Can view the list of certifications they have received
    - Can decide whether they want to make their certifications public or not

## Setup
Setting up DCertify is pretty simple. This project has been created with Truffle. Please follow the following instructions to run DCertify:

1. clone the repository to your local machine:
**git clone ...**

and install node modules:
**npm install**

2. Edit your truffle.js (or truffle-config.js) file with your network settings. You may need to edit the IP and port where your Ethereum client is running.

3. Compile and migrate your contracts from within your project folder:
**truffle compile**
**truffle migrate**
Note: keep in mind that the account[0] will be associated an Admin role. You can run the tests for the smart contracts by running:
**truffle test**

4. Install and configure Metamask to point to your network. You will need at least 3 different accounts to fully test all functionality (admin, institution and student).

5. Start your application:
**npm run start**

6. Browse to:
[http://localhost:3000]

## Screenshots
Below you can find screenshots of different functionalities within the tool:

### Invalid Account Dashboard
![alt text](https://github.com/asuarezgrupobme/dCertify/blob/master/img/00.png "Invalid account")

### Admin Dashboard
![alt text](https://github.com/asuarezgrupobme/dCertify/blob/master/img/01.png "Admin dashboard")

#### Add Admin
![alt text](https://github.com/asuarezgrupobme/dCertify/blob/master/img/02.png "Add admin and signing tx")
![alt text](https://github.com/asuarezgrupobme/dCertify/blob/master/img/03.png "Transaction confirmed")

#### Add Institution
![alt text](https://github.com/asuarezgrupobme/dCertify/blob/master/img/04.png "Add institution")

#### Update Issuing Price
![alt text](https://github.com/asuarezgrupobme/dCertify/blob/master/img/05.png "Set Issuing Price")

### Institution Dashboard
![alt text](https://github.com/asuarezgrupobme/dCertify/blob/master/img/07.png "Institution dashboard")

#### Create certification
![alt text](https://github.com/asuarezgrupobme/dCertify/blob/master/img/08.png "Create certification")
![alt text](https://github.com/asuarezgrupobme/dCertify/blob/master/img/10.png "View certifications")

#### Issue certification to student
![alt text](https://github.com/asuarezgrupobme/dCertify/blob/master/img/11.png "Issue certification to student")

### Student Dashboard
![alt text](https://github.com/asuarezgrupobme/dCertify/blob/master/img/12.png "View certifications received and Change certifications visibilityt")


