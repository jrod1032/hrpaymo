import React from 'react'
import Navbar from './Navbar.jsx';
import SimplePieChart from './userPieChart.jsx';
import UserBarChart from './userBarChart.jsx';
import RadialEmojiChart from './RadialEmojiChart.jsx'
import Paper from 'material-ui/Paper';
import { Link, Route, Switch } from 'react-router-dom';
import axios from 'axios'


const style = {
  height: 500,
  width: 600,
  margin: 50,
  textAlign: 'center',
  display: 'inline-block',
  color: 'primary'
};


class DataAnalytics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: 'barChart',
      usernames: []
    }

  }

  componentDidMount() {
    axios('/usernames', { params: { userId: this.props.userInfo.userId }})
    .then(response => {
      this.setState({
        usernames: response.data.usernames
      });
    })
    .catch(err => {
      console.error(err);
    })    
  }

  handleClick (e) {
   this.setState({
    display: e.target.value
   })
  }

  render() {

    var statToDisplay = () => {
      if (this.state.display === 'barChart') {
        return (
          <UserBarChart 
            userInfo={this.props.userInfo}
            usernames={this.state.usernames}
          />
          )
      }
      else if (this.state.display === 'pieChart') {
        return (
          <SimplePieChart
            userId={this.props.userInfo.userId}
            />
          )
      } else {
        return (
          <RadialEmojiChart 
            userInfo={this.props.userInfo}
            usernames={this.state.usernames}
            />
          )
      }
    }
    return (
      <Paper style={style} zDepth={5}>
      <div>
          <button value="barChart" onClick={this.handleClick.bind(this)}> Bart Chart</button>
          <button value="pieChart" onClick={this.handleClick.bind(this)}> Pie Chart</button>
          <button value="radialChart" onClick={this.handleClick.bind(this)}> Radial Chart</button>           
      </div>
      {statToDisplay()}
      </Paper> 
      )
  }
}

  
export default DataAnalytics;