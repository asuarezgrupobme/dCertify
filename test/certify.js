var Certify = artifacts.require("./Certify.sol");

contract('Certify', function(accounts) {

  var adminAccount = accounts[0];
  var institutionAccount  = accounts[1];
  var studentAccount  = accounts[2];

  var institutionInfoIpfsHash = "123456";
  var certificationInfoIpfsHash = "943827942";

  var pricePerCertification = 0.05; //in ethers
  it("Should check Admin Role.", function() {
    return Certify.deployed().then(function(instance) {
      certifyInstance = instance;

      return certifyInstance.getMyRole.call({from: adminAccount});
    }).then(function(role) {
      assert.equal(role, 1, "Account 0 should be Admin");
    });
  });

  it("Should add Admin.", function() {
    return Certify.deployed().then(function(instance) {
      certifyInstance = instance;
      return certifyInstance.addAdmin(accounts[3], {from: adminAccount});
    }).then(function() {
      return certifyInstance.getRole.call(accounts[3], {from: adminAccount});
    }).then(function(role) {
      assert.equal(role, 1, "Account 0 should be Admin now");
    });
  });

  it("Should create a new Institution.", function() {
    return Certify.deployed().then(function(instance) {
      certifyInstance = instance;
      
      return certifyInstance.addInstitution(institutionAccount, institutionInfoIpfsHash, {from: adminAccount});
    }).then(function() {
      return certifyInstance.getMyRole.call({from: institutionAccount});
    }).then(function(role) {
      assert.equal(role, 2, "Account 1 should be Institution");
    });
  });

  it("Should create a new Certification.", function() {
    return Certify.deployed().then(function(instance) {
      certifyInstance = instance;
      
      return certifyInstance.createCertification(certificationInfoIpfsHash, {from: institutionAccount});
    }).then(function() {
      return certifyInstance.getInstitutionCertificationsCount.call({from: institutionAccount});
    }).then(function(count) {
      assert.equal(count, 1, "There should be 1 certification for Institution 1");
      return certifyInstance.getInstitutionCertification.call(0,{from: institutionAccount});
    }).then(function(ipfsHashInfo) {
      assert.equal(ipfsHashInfo, certificationInfoIpfsHash, "Certification's ipfsh hash doesn't match.");
    });
  });

  it("Check role of Student.", function() {
    return Certify.deployed().then(function(instance) {
      certifyInstance = instance;
      
      return certifyInstance.getMyRole( {from: studentAccount});
    }).then(function(role) {
      assert.equal(role, 0, "Student's role should be Invalid at this point");
    });
  });

  it("Should update price per certification", function() {
    
    var wei =  web3.toWei(pricePerCertification,'ether');

    return Certify.deployed().then(function(instance) {
      certifyInstance = instance;
      return certifyInstance.updatePricePerCertification(wei, {from: adminAccount});
    }).then(function() {
      
    })
  });

  it("Should issue Certification to Student.", function() {  
    var wei =  web3.toWei(pricePerCertification,'ether');

    return Certify.deployed().then(function(instance) {
      certifyInstance = instance;
      debugger
      return certifyInstance.getMyRole( {from: studentAccount});
    }).then(function(role) {
      const issueDate = new Date(2018, 6, 15);
      assert.equal(role, 0, "Student's role should be Invalid at this point");
      return certifyInstance.issueCertificacionToStudent(studentAccount, certificationInfoIpfsHash, issueDate.getTime(), 6.33*100, {from: institutionAccount, value: wei});
    }).then(function() {
      return web3.eth.getBalance(certifyInstance.address);
    }).then(function(balance){
      return certifyInstance.getMyRole( {from: studentAccount});
    }).then(function(role) {
      assert.equal(role.toNumber(), 3, "Student's role should be valid now.");
      return certifyInstance.getStudentCertificationsCount.call(studentAccount, {from: studentAccount});
    }).then(function(count) {
      assert.equal(count, 1, "Student should have 1 certification.");
      return certifyInstance.getStudentCertification.call(studentAccount, 0, {from: studentAccount});
    }).then(function(certification) {
      assert.equal(certification[0], certificationInfoIpfsHash, "Student's certification doesn't match.");
    });
  });

  
  it("Should withdraw funds.", function() {
    
    var wei =  web3.toWei(pricePerCertification,'ether');

    var _initialBalance;
    return Certify.deployed().then(function(instance) {
      certifyInstance = instance;
      return web3.eth.getBalance(adminAccount)
    }).then(function(balance){
      _initialBalance = balance.toNumber();
      return certifyInstance.withdraw(wei, {from: adminAccount});
    }).then(function() {
      return web3.eth.getBalance(adminAccount)
    }).then(function(balance){
      if(balance.toNumber()<= _initialBalance) throw("new balance should be greater"); //not considering gas used in transaction    
    })
  });
});
