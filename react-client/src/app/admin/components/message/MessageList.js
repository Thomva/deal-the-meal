import { default as React, useEffect, useState, Fragment } from 'react';
import { default as classnames } from 'classnames';

import $ from 'jquery'; 

import { useApi } from '../../../services';
import { useToast } from '../../services';

import MessagesTable from './MessagesTable';

import './MessageList.scss';

const MessageList = ({children, className, limit = 10, skip = 1, onEdit}) => {  
  const { deleteMessage, findAllMessages } = useApi();
  const { addToast } = useToast();
  const [ messages, setMessages ] = useState();
  const [ currentPageIndex, setCurrentPageIndex ] = useState(skip);
  const [ pagination, setPagination ] = useState({
    limit,
    page: skip,
    pages: 1,
    total: 1
  });
  const [ messageToDelete, setMessageToDelete ] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {        
      const data = await findAllMessages({
        limit: pagination.limit,
        skip: currentPageIndex
      });
      console.log(data);
      setMessages(data);
      setPagination({ 
        limit: data.limit, 
        page: data.page, 
        pages: data.pages, 
        total: data.total 
      });
    }

    if (messageToDelete === null) {
      fetchMessages();
    }
    
  }, [findAllMessages, currentPageIndex, messageToDelete, pagination.limit]);

  const handlePage = (ev, pageIndex) => {
    ev.preventDefault();

    setCurrentPageIndex(pageIndex);
  }

  const handleDelete = (messageId, mode) => {
    setMessageToDelete({
      message: messages.find(message => message.id === messageId),
      mode,
    });
    
    $('#confirmModal').modal('show');
  }

  const handleDeleteConfirm = async () => {
    const deletedMessage = await deleteMessage(messageToDelete.message.id, messageToDelete.mode);

    addToast({
      title: `Admin: Message`,
      message: `Succesfully ${messageToDelete.mode} the message with id ${deletedMessage.id} and title ${deletedMessage.title}`
    });

    $('#confirmModal').modal('hide');

    setMessageToDelete(null);
  }

  const handleEdit = (messageId) => {
    if (typeof onEdit === 'function') {
      onEdit(messageId);
    }
  }

  return (
    <div className={className}>
      <div className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Messages</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <MessagesTable messages={messages} onDelete={handleDelete} onEdit={handleEdit}  />
          </div>          
        </div>
        <div className="card-footer">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
              {(pagination.page > 1) ? (<li className="page-message"><button className="page-link" onClick={ev => handlePage(ev, pagination.page - 1)}>Previous</button></li>) : ''}
              {
                Array(pagination.pages).fill(true).map((message, index) => (
                  <li key={index} className={classnames('page-message', (pagination.page === index + 1) ? 'active' : '' )}><button className="page-link" onClick={ev => handlePage(ev, index + 1)}>{index + 1}</button></li>
                ))
              }
              {(pagination.page !== pagination.pages) ? (<li className="page-message"><button className="page-link" onClick={ev => handlePage(ev, pagination.page + 1)}>Next</button></li>) : ''}                
            </ul>
          </nav>
        </div>
      </div>
      <div className="modal fade" id="confirmModal" tabIndex="-1" role="dialog" aria-labelledby="confirmModal" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{!!messageToDelete ? (
                <Fragment>{messageToDelete.mode} the selected message</Fragment>
              ) : ''}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {!!messageToDelete ? (
                <p>Dou yo wish to {messageToDelete.mode} the message with id: {messageToDelete.message.id} and title: {messageToDelete.message.title}?</p>
              ) : ''}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={ev => handleDeleteConfirm(ev)}>{!!messageToDelete ? (
                <Fragment>{messageToDelete.mode}</Fragment>
              ) : ''}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageList;