import { default as React } from 'react';
import { default as classnames } from 'classnames';
import { default as moment } from 'moment';

const CategoriesTable = ({children, categories, onDelete, onEdit}) => {

  const handleDelete = (event, categoryId, deleteMode = 0) => {
    if (typeof onDelete === 'function') {
      onDelete(categoryId, deleteMode);
    }
  };

  const handleEdit = (event, categoryId) => {
    if (typeof onEdit === 'function') {
      onEdit(categoryId);
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories && categories.map(category => (
          <tr
            key={category.id}
          >
            <td>{category.name}</td>
            <td>
              {moment(categories._createdAt).format('DD/MM/YYYY')}
            </td>
            <td className="d-flex justify-content-around">
              <div aria-label="edit" onClick={ev => handleEdit(ev, category.id)}><i className="fas fa-edit"></i></div>
              <div className={classnames(category._deletedAt === null ? 'soft-deleted' : 'soft-undeleted')} aria-label="delete" onClick={ev => handleDelete(ev, category.id, category._deletedAt === null ? 'softdelete' : 'softundelete', 'delete')}><i className="fas fa-trash-alt"></i></div>
              <div aria-label="delete-forever" onClick={ev => handleDelete(ev, category.id, 'delete')}><i className="fas fa-trash"></i></div>              
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoriesTable;