import { default as React } from 'react';
import { default as classnames } from 'classnames';
import { default as moment } from 'moment';

const UsersTable = ({children, users, onDelete, onEdit}) => {

  const handleDelete = (event, userId, deleteMode = 0) => {
    if (typeof onDelete === 'function') {
      onDelete(userId, deleteMode);
    }
  };

  const handleEdit = (event, userId) => {
    if (typeof onEdit === 'function') {
      onEdit(userId);
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Show last name</th>
          <th>Roles</th>
          <th>Messages</th>
          <th>Items</th>
          <th>Email</th>
          <th>First name</th>
          <th>Last name</th>
          <th>Location</th>
          <th>Rating</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users && users.map(user => {
          const roleNames = user.roles.map(r => r.name);
          const itemTitles = user.items.map(i => i.title);
          
          return (
          <tr
            key={user.id}
          >
            <td>{(user.showLastName) ? 'true' : 'false'}</td>
            <td>{roleNames && roleNames.join(', ')}</td>
            <td>{user._messageIds && user._messageIds.join(', ')}</td>
            <td>{itemTitles && itemTitles.join(', ')}</td>
            <td>{user.email}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.location}</td>
            <td>{user.userrating.average}</td>
            <td>
              {moment(users._createdAt).format('DD/MM/YYYY')}
            </td>
            <td className="d-flex justify-content-around">
              <div aria-label="edit" onClick={ev => handleEdit(ev, user.id)}><i className="fas fa-edit"></i></div>
              <div className={classnames(user._deletedAt === null ? 'soft-deleted' : 'soft-undeleted')} aria-label="delete" onClick={ev => handleDelete(ev, user.id, user._deletedAt === null ? 'softdelete' : 'softundelete', 'delete')}><i className="fas fa-trash-alt"></i></div>
              <div aria-label="delete-forever" onClick={ev => handleDelete(ev, user.id, 'delete')}><i className="fas fa-trash"></i></div>              
            </td>
          </tr>
        )})}
      </tbody>
    </table>
  );
};

export default UsersTable;