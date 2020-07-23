import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const MessageEdit = ({className, children, message, onStore = null, onUpdate = null, items, users}) => {
  const [messageForm, setMessageForm] = useState({
    txtBody: '',
    ddlItem: '',
    ddlSender: '',
    ddlReceiver: '',
  });

  useEffect(() => {
    console.log(message);
    if (message) {
      setMessageForm({
        txtBody: message.body,
        ddlItem: message._itemId,
        ddlSender: message._senderId,
        ddlReceiver: message._receiverId,
      });
    }
  }, [message])

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log('submit');

    const newMessage = {
      body: messageForm.txtBody,
      itemId: messageForm.ddlItem,
      senderId: messageForm.ddlSender,
      receiverId: messageForm.ddlReceiver,
    };

    if (message && message._id) {
      onUpdate({
        ...newMessage,
        _id: message._id,
      });      
    } else {
      onStore(newMessage);
    }
  }

  const handleInputChange = (ev) => {
    console.log(ev.target.name, ev.target.name);
    setMessageForm({
      ...messageForm,
      [ev.target.name]: ev.target.value
    });
  }

  const handleSelectChange = (ev) => {
    setMessageForm({
      ...messageForm,
      [ev.target.name]: ev.target.options[ev.target.selectedIndex].value
    });
  }
  
  return (
    <div className={classnames(className)}>
      <div className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">{!!message ? <Fragment>Update the message: {message.body}</Fragment> : <Fragment>Create a new message</Fragment>}</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="txtBody">Body</label>
              <input type="text" className="form-control" id="txtBody" name="txtBody" required defaultValue={messageForm['txtBody']} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="ddlItem">Item</label>
              <select className="form-control" id="ddlItem" name="ddlItem" onChange={handleSelectChange} value={messageForm['ddlItem']}>
                {items && items.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ddlSender">Sender</label>
              <select className="form-control" id="ddlSender" name="ddlSender" onChange={handleSelectChange} value={messageForm['ddlSender']}>
                {users && users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ddlReceiver">Receiver</label>
              <select className="form-control" id="ddlReceiver" name="ddlReceiver" onChange={handleSelectChange} value={messageForm['ddlReceiver']}>
                {users && users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">{!!message ? 'Update' : 'Save'} message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

MessageEdit.prototypes = {
  className: PropTypes.string,
  viewModel: PropTypes.object
};

export default MessageEdit;