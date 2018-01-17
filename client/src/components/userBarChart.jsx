import React from 'react'
import {BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import axios from 'axios'
import AutoComplete from 'material-ui/AutoComplete';

// const data = [
//       {name: 'Jarrod', uv: 41, pv: -20},
//       {name: 'Cody', uv: 20, pv: -60},
//       {name: 'Cherry', uv: 101, pv: -130},
//       {name: 'Santiago', uv: 47, pv: -65},
//       {name: 'Other', uv: 40, pv: -91},
// ]

const style = {
  form: {
  },
  input: {
    background: '#fff',
    flex: 'auto',
  },
  button: {
    label: {
      color: '#fff',
      position: 'relative'
    },
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    width: 30,
  }
}

class UserBarChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      amountSpent: 0,
      chart: [],
      compareUser: '',
      usernames: []
    }
  }

  getBarData () {
    console.log('getdataname?', this.props.userInfo.username);
    axios.get(`userData/totaltransactions/${this.props.userInfo.username}`, 
      {params: {username: this.state.username}})
    .then ( ({data}) => {
      console.log('all amounts: ', data)
      var total = data.reduce( (accumulator, amountObj) => {
        return accumulator + parseFloat(amountObj.amount);
      }, 0)
      console.log('amount', total)
      this.setState({
        chart: [{name: 'Jarrod', spent: -total, paid: 20}]
      })

    })
    .catch( (err) => {
      console.log(err.message)
    })

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

  onDropdownInput(searchText) {
    this.setState({
      compareUser: searchText
    })
  }  

  searchUserStats () {
    var userToCompare = this.state.compareUser;
    console.log('comparing user: ', userToCompare);
    axios.get(`userData/totaltransactions/${userToCompare}`, {params: {userId: this.props.userId}})
    .then ( ({data}) => {
      var total = data.reduce( (accumulator, amountObj) => {
        return accumulator + parseFloat(amountObj.amount);
      }, 0)

      // var newChart = this.state.chart;
      // newChart.push({name: userToCompare, spent: -total, paid: 50})
      var thisChart = {name: userToCompare, spent: -total, paid: 50};
      console.log('new chart: ', thisChart)
      this.setState({
        chart: [thisChart]
      })

    })
  }

  render () {
    console.log('state chart: ', this.state.chart)
    return (
      <div className="form-box payment-username">
        <AutoComplete
          hintText="Compare with a Friend"
          floatingLabelText="Username:"
          style={style.input}
          name='payeeUsername'
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={this.state.usernames ? this.state.usernames : []}
          maxSearchResults={7}
          searchText={this.state.payeeUsername}
          onUpdateInput = {this.onDropdownInput.bind(this)}
        />
        <button className='btn' onClick={this.getBarData.bind(this)}>Render My Data</button>
        <button className='btn' onClick={this.searchUserStats.bind(this)}>Get Info</button>
        <BarChart width={600} height={300} data={this.state.chart}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
           <XAxis dataKey="name"/>
           <YAxis/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip/>
           <Legend />
           <ReferenceLine y={0} stroke='#000'/>
           <Bar dataKey="paid" fill="#8884d8" />
           <Bar dataKey="spent" fill="#82ca9d" />
        </BarChart>
      </div>      
    );
  }


}

export default UserBarChart