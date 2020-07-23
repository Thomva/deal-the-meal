import { default as React } from 'react';
import { default as classnames } from 'classnames';
import { default as moment } from 'moment';

const MessagesTable = ({children, messages, onDelete, onEdit}) => {

  const handleDelete = (event, messageId, deleteMode = 0) => {
    if (typeof onDelete === 'function') {
      onDelete(messageId, deleteMode);
    }
  };

  const handleEdit = (event, messageId) => {
    if (typeof onEdit === 'function') {
      onEdit(messageId);
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Message</th>
          <th>Item</th>
          <th>Sender</th>
          <th>Receiver</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {messages && messages.map(message => (
          <tr
            key={message.id}
          >
            <td>{message.body}</td>
            <td>{message.item.title}</td>
            <td>{`${message.sender.firstName} ${message.sender.lastName}`}</td>
            <td>{`${message.receiver.firstName} ${message.receiver.lastName}`}</td>
            <td>
              {moment(messages._createdAt).format('DD/MM/YYYY')}
            </td>
            <td className="d-flex justify-content-around">
              <div aria-label="edit" onClick={ev => handleEdit(ev, message.id)}><i className="fas fa-edit"></i></div>
              <div className={classnames(message._deletedAt === null ? 'soft-deleted' : 'soft-undeleted')} aria-label="delete" onClick={ev => handleDelete(ev, message.id, message._deletedAt === null ? 'softdelete' : 'softundelete', 'delete')}><i className="fas fa-trash-alt"></i></div>
              <div aria-label="delete-forever" onClick={ev => handleDelete(ev, message.id, 'delete')}><i className="fas fa-trash"></i></div>              
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MessagesTable;