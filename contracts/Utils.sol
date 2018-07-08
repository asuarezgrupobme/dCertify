pragma solidity ^0.4.17;

library Utils {

    enum UserRole { Invalid, Admin, Institution, Student }
    
    struct Date {        
        uint year;
        uint month;
        uint day;
    }

    struct Institution {
        string ipfsHashInfo;
        string[] certificationsIpfsHash;
    }

    struct StudentCertification {
        string ipfsHash;
        uint issueTimeMiliseconds; //miliseconds since 1/1/1970
        uint score;
    }

    struct Student {
        StudentCertification[] certificationsReceived;
        mapping (string => bool) hasCertification;
        bool allowPublicView;
    }
}