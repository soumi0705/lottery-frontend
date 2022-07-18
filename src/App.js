import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: '',
    message: ''
  };
  async componentDidMount() {
    try {
      const manager = String(await lottery.methods.manager().call());
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      this.setState({ manager, players, balance });
    } catch (err) {
      console.log(err);
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({message: 'Waiting on transaction success...'});
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });
    this.setState({message: 'You have entered !'});
  }
  onClick = async () => {
    this.setState({message: 'Waiting on transaction success...'});
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    this.setState({message: 'A Winner has been picked!'});
  }
  render() {
    web3.eth.getAccounts().then(console.log);

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}. There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, "ether")} ether!        
        </p>
        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4> Want to try your luck </h4>
          <div>
            <label>Amount of ether to enter</label>
            <input 
              value={this.state.value}
              onChange={event=>this.setState({value: event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr/>

        <h4>Ready to pick a winner</h4>
        <button onClick={this.onClick}>Pick a Winner</button>
        <hr/>

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
