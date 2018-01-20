import React from 'react';
import axios from 'axios';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';

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

class Payment extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      payeeUsername: '',
      amount: '',
      note: '',
      paymentFail: false,
      usernames: [],
      emojis: []
    }
  }

  componentDidMount() {
    axios('/usernames', { params: { userId: this.props.payerId }})
    .then(response => {
      this.setState({
        usernames: response.data.usernames
      });
    })
    .catch(err => {
      console.error(err);
    })
  }
  
  handleInputChanges (event) {
    let target = event.target;
    this.setState({
      [target.name] : target.value
    })
  }

  getEmojiOnNoteChange (searchText) {
    this.setState({
      note : searchText
    })
    if (searchText.length > 2) {
      axios.get('/emoji', {params: {note: searchText}})
        .then( ({data}) => {
          var arrayOfEmojis = data.rows.map( (reactionObj) => {
            return reactionObj.r_emoji;
          })
          this.setState({
            emojis: arrayOfEmojis
          })
        })
        .catch(err => console.log(err))    
    }
  }

  onDropdownInput(searchText) {
    this.setState({
      payeeUsername: searchText
    })
  }

  payUser() {
    let payment = {
      payerId: this.props.payerId,
      payeeUsername: !this.state.payeeUsername ? this.props.payeeUsername : this.state.payeeUsername,
      amount: this.state.amount,
      note: this.state.note
    };
    axios.post('/pay', payment)
      .then((response) => {
        this.setState({
          payeeUsername: '',
          amount: '',
          note: '',
          paymentFail: false
        });
        this.props.refreshUserData(this.props.payerId);
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              console.error('UNAUTHORIZED:', error.response);
              break;
            case 422:
              console.error('UNPROCESSABLE ENTRY:', error.response);
              break;
            case 400:
              console.error('BAD REQUEST:', error.response);
              break;
          }
        } else {
          console.error('Error in payment component:', error);
        }
        this.setState({
          paymentFail: true
        });
      })
  }

  render() {
    return (
      <Paper className='payment-container' style={style.form}>
        <div className='payment-item-container'>         
            {!this.props.payeeUsername && 
              <div className="form-box payment-username">
                <AutoComplete
                  hintText="Enter a username"
                  floatingLabelText="To:"
                  style={style.input}
                  name='payeeUsername'
                  filter={AutoComplete.caseInsensitiveFilter}
                  dataSource={this.state.usernames ? this.state.usernames : []}
                  maxSearchResults={7}
                  searchText={this.state.payeeUsername}
                  onUpdateInput = {this.onDropdownInput.bind(this)}
                />
              </div>
            }
          <br />
          <div className="form-box payment-amount">
            <TextField
              style={style.input}
              name='amount'
              value={this.state.amount}
              onChange = {this.handleInputChanges.bind(this)}
              hintText="Enter an amount"
              floatingLabelText="$"
            />
          <br />
          </div>
          <div className="form-box payment-note">
                <AutoComplete
                  hintText="For"
                  floatingLabelText="Leave a comment"
                  style={style.input}
                  name='note'
                  dataSource={this.state.emojis ? this.state.emojis : []}
                  filter={AutoComplete.noFilter}
                  maxSearchResults={3}
                  searchText={this.state.note}
                  onUpdateInput = {this.getEmojiOnNoteChange.bind(this)}
                />            
          <br />
          </div>
        </div>

        <button className='btn' onClick={this.payUser.bind(this)}>Pay</button>
        {this.state.paymentFail
          ? <label className='error-text'>
              Error in payment processing
            </label>
          : null
        }
      </Paper>
    );
  }
}

export default Payment;