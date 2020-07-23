import { default as React } from 'react';
import { default as classnames } from 'classnames';
import { default as moment } from 'moment';

const RolesTable = ({children, roles, onDelete, onEdit}) => {

  const handleDelete = (event, roleId, deleteMode = 0) => {
    if (typeof onDelete === 'function') {
      onDelete(roleId, deleteMode);
    }
  };

  const handleEdit = (event, roleId) => {
    if (typeof onEdit === 'function') {
      onEdit(roleId);
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Id</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {roles && roles.map(role => (
          <tr
            key={role.id}
          >
            <td>{role.name}</td>
            <td>{role.id}</td>
            <td>
              {moment(roles._createdAt).format('DD/MM/YYYY')}
            </td>
            <td className="d-flex justify-content-around">
              <div aria-label="edit" onClick={ev => handleEdit(ev, role.id)}><i className="fas fa-edit"></i></div>
              <div className={classnames(role._deletedAt === null ? 'soft-deleted' : 'soft-undeleted')} aria-label="delete" onClick={ev => handleDelete(ev, role.id, role._deletedAt === null ? 'softdelete' : 'softundelete', 'delete')}><i className="fas fa-trash-alt"></i></div>
              <div aria-label="delete-forever" onClick={ev => handleDelete(ev, role.id, 'delete')}><i className="fas fa-trash"></i></div>              
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RolesTable;