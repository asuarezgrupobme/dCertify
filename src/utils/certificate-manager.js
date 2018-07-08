
const IPFS = require('ipfs')

import { default as contract } from 'truffle-contract'

// Import libraries we need.
import Web3 from 'web3'

// Import our contract artifacts and turn them into usable abstractions.
import CertifyContractArtifacts from '../../build/contracts/Certify.json'

//CertificateManager library
class CertificateManager {

  /**
   * Create a certificate manager.
   * @constructor
   */
  constructor () {
    this.accounts = null;
    this.myAccount = null;
    this.certifyContract = null;
    this.certifyInstance = null;
    this.nodeIPFS = null;
    this.userRole = -1;
    this.web3 = null;
  }

  //add a JSON to IPFS (private function)
  _addJsonToIPFS (json, callbackSuccess, callbackFailure){
    
    var stringifyJSon = JSON.stringify(json);

    this.nodeIPFS.files.add({
      path: 'file.json',
      content: Buffer.from(stringifyJSon)
    }, (err, result) => {
      if (err) {
        if(callbackFailure) callbackFailure("Couldn't publish certificate. Error: " + err)
      }
      else {
        console.log('\nAdded file:', result[0].path, result[0].hash)
        var fileMultihash = result[0].hash
        if(callbackSuccess) callbackSuccess(fileMultihash)
      }
    });
  }

  _getJSonFromIPFS(ipfsHash, callbackSuccess, callbackFailure){
    this.nodeIPFS.files.cat(ipfsHash, (err, stream) => {
      if (err) {
        if(callbackFailure) callbackFailure(err);
      }
      else {
        var res = stream.toString('utf8');
        var json = eval ("(" + res + ")");
        if(callbackSuccess) callbackSuccess(json);
      }
    })
  }
  
  //Associates a IPFS hash to a insitution (private function)
  _associateInstitutionInfo (receiver, ipfsHash, callbackSuccess, callbackFailure){
    var self = this;

    if(!self.web3.isAddress(receiver)){
      if(callbackFailure) callbackFailure("Invalid Ethereum address.")
      return;
    }

    self.certifyInstance.addInstitution(receiver, ipfsHash, {from: self.myAccount}).then(function(txObj) {
      if(txObj && txObj.receipt && txObj.receipt.status==0){
        if(callbackFailure) callbackFailure("Couldn't associate institution info. Returning transaction with status = 0.");
      }
      else if(callbackSuccess)
        callbackSuccess(txObj, ipfsHash);
    }).catch(function(e) {
        if(callbackFailure) callbackFailure("Couldn't associate institution info. Error: " + e);
    });
  }

  //Associates a IPFS hash to a certificate (private function)
  _associateCertificateToInstitution (ipfsHash, callbackSuccess, callbackFailure){
    var self = this;

    self.certifyInstance.createCertification(ipfsHash, {from: self.myAccount}).then(function(txObj) {
      if(txObj && txObj.receipt && txObj.receipt.status==0){
        if(callbackFailure) callbackFailure("Couldn't associate certification to institution. Returning transaction with status = 0.");
      }
      else if(callbackSuccess)
        callbackSuccess(txObj, ipfsHash);
    }).catch(function(e) {
        if(callbackFailure) callbackFailure("Couldn't associate certification to institution. Error: " + e);
    });
  }

  
  /**
  * Initializes the CertificateManager library
  * @param {object} config - The config settings object to initialize the manager. Parameters: web3's provider.
  * @param {function} callbackSuccess - The callback function.
  */
  init (config, callbackSuccess){
    var self = this;
    var web3 = window.web3

    if(config == null || config == undefined ||
      config.provider == null || config.provider == undefined){
      if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 ether, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
      }
      else {
        alert("No web3 detected.");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      }
    }
    else {
      window.web3 = new Web3(config.provider);
    }

    // certifyContract is our usable abstraction, which we'll use through the code below.
    self.certifyContract = contract(CertifyContractArtifacts);

    self.certifyContract.setProvider(web3.currentProvider);

    self.web3 = web3;
    //wait for accounts
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }


      
      var _self = self;
      setInterval(function() {
        if (_self.accounts.length !== _self.web3.eth.accounts.length || 
          (_self.web3.eth.accounts.length >0 && _self.web3.eth.accounts[0] !== _self.myAccount)) {
            document.location.href="/";
        }
      }, 300);

      
      if(accs.length === 0){
        self.userRole = -1;        
        self.accounts = [];
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      self.accounts = accs;//all accounts
      self.myAccount = accs[0];//my account

      //initizalize IPFS
      self.nodeIPFS = new IPFS();
      self.nodeIPFS.on('ready', function(){
        console.log("IPFS node is ready");

        //get my role
        self.certifyContract.deployed().then((instance) => {
          self.certifyInstance = instance;
          return self.certifyInstance.getMyRole({from: self.myAccount})
        }).then((result) => {
          var role = result.toNumber();
          self.userRole = role;
          if(callbackSuccess) callbackSuccess();
        })
      });
    });
  }

  /**
  * Add a new admin to the system.
  * @param {string} receiver - The address of the admin.
  * @param {function} callbackSuccess - The callback function to be executed when the admin is registered successfully.
  * @param {function} callbackFailure - The callback function to be executed when an error occured.
  */
  addAdmin (receiverAddress, callbackSuccess, callbackFailure){
    var self = this;

    if(!self.web3.isAddress(receiverAddress)){
      if(callbackFailure) callbackFailure("Invalid Ethereum address.")
      return;
    }

    self.certifyInstance.addAdmin(receiverAddress, {from: self.myAccount}).then(function(txObj) {
      if(txObj && txObj.receipt && txObj.receipt.status==0){
        if(callbackFailure) callbackFailure("Couldn't add admin. Returning transaction with status = 0.");
      }
      else if(callbackSuccess)
        callbackSuccess(txObj);
    }).catch(function(e) {
        if(callbackFailure) callbackFailure("Couldn't add admin. Error: " + e);
    });
  }

  /**
  * Publish a new institution in IPFS and associate the hash to the institution address.
  * @param {string} receiver - The address of the institution.
  * @param {object} json - The json representing the institution's info.
  * @param {function} callbackSuccess - The callback function to be executed when the insitution is registered successfully.
  * @param {function} callbackFailure - The callback function to be executed when an error occured.
  */
  addInstitution (receiverAddress, json, callbackSuccess, callbackFailure){
    var self = this;

    if(!self.web3.isAddress(receiverAddress)){
      if(callbackFailure) callbackFailure("Invalid Ethereum address.")
      return;
    }

    var stringifyJSon = JSON.stringify(json);
    self._addJsonToIPFS (stringifyJSon, function(ipfsHash){
      self._associateInstitutionInfo(receiverAddress, ipfsHash, callbackSuccess, callbackFailure)
    })
  }

  /**
  * Publish a new certificate in IPFS and associate the hash to the address.
  * @param {object} json - The json representing the certificate (Open Badge format).
  * @param {function} callbackSuccess - The callback function to be executed when the certificate is registered successfully.
  * @param {function} callbackFailure - The callback function to be executed when an error occured.
  */
  createCertificate (json, callbackSuccess, callbackFailure){
    var self = this;

    self._addJsonToIPFS (json, function(ipfsHash){
      self._associateCertificateToInstitution(ipfsHash, callbackSuccess, callbackFailure)
    })
  }

  /**
  * Returns a the list of certificates created by an Institution
  * @param {function} callbackSuccess - The callback function to be executed when the list of certificates is retrieved successfully.
  * @param {function} callbackFailure - The callback function to be executed when an error occured.
  */
  getInstitutionCertificates (callbackSuccess, callbackFailure){
    var self = this;

    var _list = [];
    var _totalCertificates;

    var _fnGetCertification = function(index){
      if(_totalCertificates>_list.length){
        self.certifyInstance.getInstitutionCertification(index, {from: self.myAccount}).then(function(ipfsHash){
          self._getJSonFromIPFS(ipfsHash,
            function(json){
              _list.push({hash: ipfsHash, content: json});
              _fnGetCertification(index+1);
            },
            function(e){
                if(callbackFailure) callbackFailure("Couldn't get certificate " + index + ". Error: " + e);
            });
        });
      }
      else {
        if(callbackSuccess) callbackSuccess(_list);
      }
    }

    self.certifyInstance.getInstitutionCertificationsCount({from: self.myAccount}).then(function(count){
      _totalCertificates = count.toNumber();
      _fnGetCertification(0);
    }).catch(function(e) {
        if(callbackFailure) callbackFailure("Couldn't get number of certificates. Error: " + e);
    });
  }  

  /**
  * Issue a certificate to a student´s address and associate the hash to the address.
  * @param {object} json - The json representing the certificate (Open Badge format).
  * @param {function} callbackSuccess - The callback function to be executed when the certificate is registered successfully.
  * @param {function} callbackFailure - The callback function to be executed when an error occured.
  */
  issueCertificacionToStudent (receiverAddress, ipfsHash, date, score, callbackSuccess, callbackFailure){
    var self = this;
    
    self.certifyInstance.pricePerCertificate({from: self.myAccount}).then(function(weis) {
      debugger
      self.certifyInstance.issueCertificacionToStudent(receiverAddress, ipfsHash, date.getTime(), score*100, {from: self.myAccount, value: weis.toNumber()}).then(function(txObj) {
        if(txObj && txObj.receipt && txObj.receipt.status==0){
          if(callbackFailure) callbackFailure("Couldn't issue certification to student. Returning transaction with status = 0.");
        }
        else if(callbackSuccess)
          callbackSuccess(txObj, ipfsHash);
      }).catch(function(e) {
          if(callbackFailure) callbackFailure("Couldn't issue certification to student. Error: " + e);
      }).catch(function(e) {
        if(callbackFailure) callbackFailure("Couldn't get price per certification. Error: " + e);
      });
    });
  }

  /**
  * Returns a the list of certificates issued to a Student
  * @param {function} callbackSuccess - The callback function to be executed when the list of certificates is retrieved successfully.
  * @param {function} callbackFailure - The callback function to be executed when an error occured.
  */
  getStudentCertificates (studentAddress, callbackSuccess, callbackFailure){
    var self = this;

    var _list = [];
    var _totalCertificates;
    debugger
    var _fnGetCertification = function(index){
      if(_totalCertificates>_list.length){
        self.certifyInstance.getStudentCertification(studentAddress, index, {from: self.myAccount}).then(function(result){
          self._getJSonFromIPFS(result[0],
            function(json){
              _list.push({hash: result[0], content: json, issueDate: new Date(result[1].toNumber()), score:(result[2].toNumber()/100.0)});
              _fnGetCertification(index+1);
            },
            function(e){
                if(callbackFailure) callbackFailure("Couldn't get certificate " + index + ". Error: " + e);
            });
        });
      }
      else {
        if(callbackSuccess) callbackSuccess(_list);
      }
    }

    self.certifyInstance.getStudentCertificationsCount(studentAddress, {from: self.myAccount}).then(function(count){
      _totalCertificates = count.toNumber();
      _fnGetCertification(0);
    }).catch(function(e) {
        if(callbackFailure) callbackFailure("Couldn't get number of certificates. Error: " + e);
    });
  } 

  /**
  * Withdraw funds from the contract to admin address
  * @param {function} callbackSuccess - The callback function to be executed when successfully withdrawed.
  * @param {function} callbackFailure - The callback function to be executed when an error occured.
  */
  withdraw (callbackSuccess, callbackFailure){
    var self = this;

    self.certifyContract.deployed().then(function(contractself) {
      contractself.withdraw({from: self.myAccount}).then(function(txObj) {
        if(txObj && txObj.receipt && txObj.receipt.status==0){
          if(callbackFailure) callbackFailure("Couldn't withdraw funds. Returning transaction with status = 0.");
        }
        else if(callbackSuccess)
          callbackSuccess(txObj.tx);
      }).catch(function(e) {
          if(callbackFailure) callbackFailure(e);
      });
    });
  }

  /**
  * Set the price in ether to be charged to institutions when registering a new certificate
  * @param {number} ether - The amount in ether to be chared when registering a new certificate.
  * @param {function} callbackSuccess - The callback function to be executed when successfully updated.
  * @param {function} callbackFailure - The callback function to be executed when an error occured.
  */
  setPrice (ether, callbackSuccess, callbackFailure){
    var self = this;

    var wei =  self.web3.toWei(ether,'ether');

    self.certifyContract.deployed().then(function(contractself) {
      contractself.updatePrice(wei, {from: self.myAccount}).then(function(txObj) {
        if(txObj && txObj.receipt && txObj.receipt.status==0){
          if(callbackFailure) callbackFailure("Couldn't set price. Returning transaction with status = 0.");
        }
        else if(callbackSuccess)
          callbackSuccess(txObj.tx);
      }).catch(function(e) {
          if(callbackFailure) callbackFailure(e);
      });
    });
  }
}

window.CertificateManager = new CertificateManager();
