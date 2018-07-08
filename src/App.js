import React, { Component } from 'react'
import CertifyContract from '../build/contracts/Certify.json'
import getWeb3 from './utils/getWeb3'
import Dashboard from './utils/dashboard'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      manager: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    var certificateManager = window.CertificateManager;
    //por ahora nos conectamos a testrpc
    var _provider = null;//new Web3.providers.HttpProvider("http://localhost:8545");
    //var _provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/0x593867282D435A64Fc3437cD43c80e92624b1a07");
    var _config = {provider: _provider};

    var _self = this;
    certificateManager.init(_config, function(){
      _self.setState({manager: certificateManager});
    })
  }

  /*
  instantiateContract() {


    const contract = require('truffle-contract')
    const certify = contract(CertifyContract)
    certify.setProvider(this.state.web3.currentProvider)

    var certifyInstance

    var _this = this;
    var _accounts;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      
      _accounts = accounts;
      
      setInterval(function() {
        if (_this.state.accounts.length !== _this.state.web3.eth.accounts.length || 
          _this.state.web3.eth.accounts[0] !== _this.state.accounts[0]) {
            document.location.href="/";
        }
      }, 300);

      if(accounts.length === 0){
        return this.setState({ userRole: -1, account: null, accounts: _accounts });
      }


      certify.deployed().then((instance) => {
        certifyInstance = instance

        return certifyInstance.getMyRole({from: _accounts[0]})
      }).then((result) => {
        var role = result.toNumber();
        // Update state with the user's role.
        return this.setState({ userRole: role, account: _accounts[0], accounts: _accounts, contract: certifyInstance })
      })
    })
  }

  */

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">DCERTIFY</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <Dashboard  manager={this.state.manager}/>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
