pragma solidity ^0.4.17;

import "./Utils.sol";

contract Certify {        

    modifier isAdmin() {require(userRoles[msg.sender] == Utils.UserRole.Admin); _;}
    modifier isInstitution() {require(userRoles[msg.sender] == Utils.UserRole.Institution); _;}
    modifier isStudent() {require(userRoles[msg.sender] == Utils.UserRole.Student); _;}
    modifier isAdminOrInstitution() {require(userRoles[msg.sender] == Utils.UserRole.Admin || userRoles[msg.sender] == Utils.UserRole.Institution); _;}
    
    modifier isRoleInvalid(address _addr) {require(userRoles[_addr] == Utils.UserRole.Invalid); _;}

    modifier certificationNotExists(string _ipfsHash) {require(certificationIpfsHashFlag[_ipfsHash] == false); _;}
    modifier certificationExists(string _ipfsHash) {require(certificationIpfsHashFlag[_ipfsHash] == true); _;}
    
    modifier enoughPay() {require(msg.value >= pricePerCertificate); _;}
    
    mapping (address => Utils.UserRole) private userRoles;
    mapping (address => Utils.Institution) private mapInstitutions;
    mapping (address => Utils.Student) private mapStudents;
    
    mapping (string => bool) private certificationIpfsHashFlag;

    uint public pricePerCertificate;

    function Certify() public {
        userRoles[msg.sender] = Utils.UserRole.Admin;
        pricePerCertificate = 1; //wei
    }

    function getMyRole() public view returns (uint) {
        return uint(userRoles[msg.sender]);
    }

    function getRole(address _addr) public view returns (uint) {
        return uint(userRoles[_addr]);
    }

    function updatePricePerCertificate(uint _price) public isAdmin {
        pricePerCertificate = _price;
    }

    function addAdmin(address _addrNewAdmin) public isAdmin isRoleInvalid(_addrNewAdmin) {
        userRoles[_addrNewAdmin] = Utils.UserRole.Admin;
    }

    function addInstitution(address _addrInstitution, string _ipfsHashInfo) public isAdmin isRoleInvalid(_addrInstitution) {
        Utils.Institution memory _institution = Utils.Institution({ ipfsHashInfo: _ipfsHashInfo, certificationsIpfsHash: new string[](0)});
        mapInstitutions[_addrInstitution] = _institution;
        userRoles[_addrInstitution] = Utils.UserRole.Institution;
    }

    function createCertification(string _ipfsHash) public isInstitution certificationNotExists(_ipfsHash) {
        certificationIpfsHashFlag[_ipfsHash] = true;
        mapInstitutions[msg.sender].certificationsIpfsHash.push(_ipfsHash);
    }

    function getInstitutionCertificationsCount() public view isInstitution returns (uint) {
        return mapInstitutions[msg.sender].certificationsIpfsHash.length;
    }

    function getInstitutionCertification(uint _index) public view isInstitution returns (string) {
        require(mapInstitutions[msg.sender].certificationsIpfsHash.length>_index);
        return (mapInstitutions[msg.sender].certificationsIpfsHash[_index]);
    }

    function issueCertificacionToStudent(address _addrStudent, string _ipfsHash, uint _timeMiliseconds, uint _score) public payable isInstitution enoughPay certificationExists(_ipfsHash){
        require(userRoles[_addrStudent] == Utils.UserRole.Student || userRoles[_addrStudent] == Utils.UserRole.Invalid);       
        Utils.Student storage _student = mapStudents[_addrStudent];        
        require(_student.hasCertification[_ipfsHash] == false);
        userRoles[_addrStudent] = Utils.UserRole.Student;       
        _student.hasCertification[_ipfsHash] = true; 
        _student.certificationsReceived.push(Utils.StudentCertification(_ipfsHash, _timeMiliseconds, _score));
        msg.sender.transfer(msg.value - pricePerCertificate);
    }

    function getStudentCertificationsCount(address _addrStudent) public view returns (uint) {
        require(msg.sender == _addrStudent || mapStudents[_addrStudent].allowPublicView == true);
        return mapStudents[_addrStudent].certificationsReceived.length;
    }

    function getStudentCertification(address _addrStudent, uint _index) public view returns (string ipfsHash, uint timeMiliseconds, uint score) {   
        require(userRoles[_addrStudent] == Utils.UserRole.Student);
        require(msg.sender == _addrStudent || mapStudents[_addrStudent].allowPublicView == true);
        require(mapStudents[_addrStudent].certificationsReceived.length>_index);
        Utils.StudentCertification storage _certification = mapStudents[_addrStudent].certificationsReceived[_index];
        return (_certification.ipfsHash, _certification.issueTimeMiliseconds, _certification.score);
    }

    function setStudentCertificationsPublicView(bool _publicView) public {
        require(userRoles[msg.sender] == Utils.UserRole.Student);
        mapStudents[msg.sender].allowPublicView = _publicView;
    }

    function withdraw() public isAdmin {
        msg.sender.transfer(this.balance);
    }
}