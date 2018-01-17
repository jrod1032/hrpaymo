import React from 'react'
import ReactDOM from 'react-dom'
import {PieChart, Pie, Sector, Cell} from 'recharts'
import axios from 'axios';
// const {PieChart, Pie, Sector, Cell } = Recharts;
const data = [{name: 'Cody', value: 2}, {name: 'Cherry', value: 3},
                  {name: 'Santiago', value: 2}, {name: 'Other', value: 2}];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const RADIAN = Math.PI / 180;                    
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy  + radius * Math.sin(-midAngle * RADIAN);
 
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'}  dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class SimplePieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: []
    }
  }

  componentDidMount () {
    console.log('user id', this.props.userId)
    axios.get(`/userData/${this.props.userId}`, { params: {userId: this.props.userId}})
    .then( ({data}) => {
      console.log('transactiondata: ', data)
      var counter = data.reduce(function(allNames, name) {
        if (name.username in allNames) {
          allNames[name.username]++;
        } else {
          allNames[name.username] = 1
        }
        return allNames
      }, {})
      console.log(counter);
      var myTransactionData = [];
      for (name in counter) {
        var thisName = {};
        thisName.name = name;
        thisName.value = counter[name];
        myTransactionData.push(thisName);
      }
      console.log('array of namecounts: ',myTransactionData )
      this.setState({
        transactions: myTransactionData
      });
    })
    .catch( (err) => {
      console.log(err.message);
    })
  }
  
  render () {
    return (
      <div>
      <div>Breakdown of Transaction Amounts</div>
      <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
        <Pie
          data={this.state.transactions || data} 
          cx={300} 
          cy={200} 
          labelLine={false}
          outerRadius={80} 
          fill="#8884d8"
          label={renderCustomizedLabel}
        >
          {
            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>
      </PieChart>
      </div>
    );
  }
}



export default SimplePieChart;