import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { postAuction } from '../../actions/auctionActions';
import classnames from 'classnames';
import M from 'materialize-css/dist/js/materialize.min.js';


class AuctionForm extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      description: '',
      startingBid: 0.00,
      hasBuyItNow: false,
      buyItNow: 0.00,
      productImage: '',
      errors: {}
    };
    // binding 'this' context for event handlers
    this.handleChange = this.handleChange.bind(this);
    this.handleBuyItNowToggle = this.handleBuyItNowToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentDidMount() {
    // Character counter for description
    var inputNeedsCount = document.querySelectorAll('#description');
    M.CharacterCounter.init(inputNeedsCount);
  }

  // Deprecated vvv revise this with new lifecycle function
  componentWillReceiveProps(nextProps) {
    // when form is sucessfully submitted, 'isPosted' becomes true, redirect
    if(nextProps.auction.isPosted) {
      this.props.history.push('/auctions');
    }
    if(nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  /* ~~~~ EVENT HANDLERS ~~~~ */
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value })
  }
  handleBuyItNowToggle() {
    this.setState(prevState => ({
      hasBuyItNow: !prevState.hasBuyItNow
    }));
  }
  handleFileUpload(event) {
    this.setState({ [event.target.id]: event.target.files[0] })
  }

  // It is bad practice to update state like this if it depends on the previous state (aynchronous state updates may fuck it up)
  // handleBuyItNowToggle() {
  //   this.setState({ hasBuyItNow: !this.state.hasBuyItNow })
  // }

  handleSubmit(event) {
    // preventDefault stops the page from reloading when submit button is clicked
    event.preventDefault();
    // Todo: create auction object (will be sent to backend via Redux)
    const auctionData = {
      authorID: this.props.auth.user.id, // passing this to use on the server side
      authorName: this.props.auth.user.name,
      title: this.state.title,
      description: this.state.description,
      startingBid: this.state.startingBid, 
      hasBuyItNow: this.state.hasBuyItNow,
      buyItNow: this.state.buyItNow,
      productImage: this.state.productImage
    };
    // console.log(auctionData);
    this.props.postAuction(auctionData);
  }


  render() {
    const errors = this.state.errors;
    return (
      <div className='container'>
        <div className='row'>
          <div className='col s8 offset-s2'>
            <Link to='/auctions' className='btn-flat waves-effect'>
              <i className='material-icons left'>keyboard_backspace</i>Back to dashboard
            </Link>
            <div className='col s12' style={{ paddingLeft: '11.25px'}}>
              <h4><b>Auction</b> your item below</h4>
            </div>

            {/* Auction Form */}
            <form noValidate onSubmit={this.handleSubmit}>
              {/* Title input field */}
              <div className='input-field col s12'>
                <input 
                  onChange={this.handleChange}
                  value={this.state.email}
                  error={errors.title}
                  id='title'
                  type='text'
                  className={classnames('', {
                    invalid: errors.title
                  })}
                />
                <label htmlFor='title'>Title</label>
                <span className='red-text'>{errors.title}</span>
              </div>
              {/* Description input field */}
              <div className='input-field col s12'>
                <textarea
                  onChange={this.handleChange}
                  value={this.state.description}
                  error={errors.description}
                  id='description'
                  data-length='250'
                  className={classnames('materialize-textarea', {
                    invalid: errors.description
                  })}
                />
                <label htmlFor='description'>Description</label>
                <span className='red-text'>{errors.description}</span>
              </div>
              {/* starting bid input field */}
              <div className='input-field col s4'>
                <i className='material-icons prefix'>attach_money</i>
                <input 
                  onChange={this.handleChange}
                  id='startingBid'
                  type='number'
                  placeholder='0.00'
                  className={classnames('', {
                    invalid: errors.startingBid
                  })}
                />
                <label htmlFor='startingBid'>Starting Bid</label>
                <span className='red-text'>{errors.startingBid}</span>
              </div>
              {/* Buy it now toggle */}
              <div className="switch col s4">
                <label>Buy it now: </label>
                <div>
                  <label>
                    Off
                    <input 
                      onClick={this.handleBuyItNowToggle}
                      id='hasBuyItNow'
                      type="checkbox" 
                      value={true} // will send 'true' in post value if toggled, otherwise it is empty
                    />
                    <span className="lever"></span>
                    On
                  </label>
                </div>
              </div>
              {/* Todo: buyItNow field that shows only if the toggle is on */}

              {/* File upload */}
              {/* TODO: connect this input with the component state and handleSubmit portion */}
              <div className="file-field input-field col s9">
                <p>Image Upload:</p>
                <div className="btn waves-effect waves-light hoverable blue lighten-3 black-text">
                  <span>File</span>
                  <input 
                    onChange={this.handleFileUpload} 
                    id="productImage"
                    type="file" 
                    multiple />
                </div>
                <div className="file-path-wrapper">
                  <input disabled className="file-path validate" type="text" placeholder="Upload one or more images" />
                </div>
              </div>

              {/* Submit Button */}
              <div className='col s12' style={{ paddingLeft: '11.25px'}}>
                <button 
                  style={{
                    width: '150px',
                    borderRadius: '3px',
                    letterSpacing: '1.5px',
                    marginTop: '1rem'
                  }}
                  type='submit'
                  className='btn btn-large waves-effect waves-light hoverable blue lighten-3 black-text'
                >
                  Post Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

AuctionForm.propTypes = {
  postAuction: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auction: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  auction: state.auction
});

export default connect(
  mapStateToProps,
  { postAuction }
) (AuctionForm);
