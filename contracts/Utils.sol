pragma solidity ^0.4.17;

library Utils {

    enum UserRole { Invalid, Admin, Institution, Student }
    
    struct Institution {
        string ipfsHashInfo; // IPFS hash of file with info
        string[] certificationsIpfsHash; // array of IPFS hashes of certifications created by institution
    }

    struct StudentCertification {
        string ipfsHash; // IPFS hash of file with info
        uint issueTimeMiliseconds; //issue date in miliseconds since 1/1/1970
        uint score; // score multiplied by 100 (2 decimals)
    }

    struct Student {
        StudentCertification[] certificationsReceived; // student's certifications
        mapping (string => bool) hasCertification; // map to check if student has certification without iterating array above
        bool allowPublicView; // whether other users can view student's certifications
    }
}