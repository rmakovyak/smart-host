import React, { Component } from 'react';
import {
  generateCustomers,
  settleCustomers,
  calculateRoomUsage
} from './RoomUsage.helper';

class RoomUsage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      premium: {
        total: 0,
        value: 0
      },
      economy: {
        total: 0,
        value: 0
      },
      economyCount: 0,
      premiumCount: 0
    };

    this.handleCountChange = this.handleCountChange.bind(this);
    this.calculateRoomUsage = this.calculateRoomUsage.bind(this);
  }

  componentDidMount() {
    return fetch('payments.json')
      .then(response => response.json())
      .then(payments => {
        this.setState({
          payments
        });
      })
      .catch(e => e);
  }

  handleCountChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  calculateRoomUsage(e) {
    e.preventDefault();
    const customers = generateCustomers(this.state.payments.data);
    const settledCustomers = settleCustomers(customers, {
      premium: this.state.premiumCount,
      economy: this.state.economyCount
    });
    const roomUsage = calculateRoomUsage(settledCustomers);
    this.setState({
      ...roomUsage
    });
  }

  render() {
    return (
      <div className="App">
        <form>
          <input
            placeholder="Premium rooms count"
            type="number"
            name="premiumCount"
            value={this.state.premiumCount}
            onChange={this.handleCountChange}
          />
          <input
            placeholder="Economy rooms count"
            type="number"
            name="economyCount"
            value={this.state.economyCount}
            onChange={this.handleCountChange}
          />
          <button onClick={this.calculateRoomUsage}>
            Calculate room usage
          </button>
        </form>
        <p>
          Usage premium: {this.state.premium.total} (€{' '}
          {this.state.premium.value})
        </p>
        <p>
          Usage economy: {this.state.economy.total} (€{' '}
          {this.state.economy.value})
        </p>
      </div>
    );
  }
}

export default RoomUsage;
