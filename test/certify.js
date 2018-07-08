var Certify = artifacts.require("./Certify.sol");

contract('Certify', function(accounts) {

  var adminAccount = accounts[0];
  var institutionAccount  = accounts[1];
  var studentAccount  = accounts[2];

  var institutionInfoIpfsHash = "123456";
  var certificationInfoIpfsHash = "943827942";

  it("Should check Admin Role.", function() {
    return Certify.deployed().then(function(instance) {
      certifyInstance = instance;

      return certifyInstance.getMyRole.call({from: adminAccount});
    }).then(function(role) {
      assert.equal(role, 1, "Account 0 should be Admin");
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

  it("Should add Certification to Student.", function() {
    
    return Certify.deployed().then(function(instance) {
      certifyInstance = instance;
      return certifyInstance.getMyRole( {from: studentAccount});
    }).then(function(role) {
      console.log("step 1");
      const issueDate = new Date(2018, 6, 15);
      assert.equal(role, 0, "Student's role should be Invalid at this point");
      return certifyInstance.issueCertificacionToStudent(studentAccount, certificationInfoIpfsHash, issueDate.getTime(), 6.33*100, {from: institutionAccount, value: 1});
    }).then(function() {
      console.log("step 2");
      return certifyInstance.getMyRole( {from: studentAccount});
    }).then(function(role) {
      console.log("step 3");
      assert.equal(role.toNumber(), 3, "Student's role should be valid now.");
      return certifyInstance.getStudentCertificationsCount.call(studentAccount, {from: studentAccount});
    }).then(function(count) {
      console.log("step 4");
      assert.equal(count, 1, "Student should have 1 certification.");
      return certifyInstance.getStudentCertification.call(studentAccount, 0, {from: studentAccount});
    }).then(function(certification) {
      assert.equal(certification[0], certificationInfoIpfsHash, "Student's certification doesn't match.");
    });
  });


  it("Should withdraw funds.", function() {
    
    return Certify.deployed().then(function(instance) {
      certifyInstance = instance;
      return certifyInstance.withdraw( {from: adminAccount});
    }).then(function() {
      
    })
  });

});
