import { default as React } from 'react';
import { default as classnames } from 'classnames';
import { default as moment } from 'moment';

const ItemsTable = ({children, items, onDelete, onEdit}) => {

  const handleDelete = (event, itemId, deleteMode = 0) => {
    if (typeof onDelete === 'function') {
      onDelete(itemId, deleteMode);
    }
  };

  const handleEdit = (event, itemId) => {
    if (typeof onEdit === 'function') {
      onEdit(itemId);
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          {/* <th></th> */}
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items && items.map(item => {
          const itemPrice = item && parseFloat(item.price.amount);
          const price = (itemPrice && itemPrice > 0) ? `${item.price.currency}${itemPrice.toFixed(2).replace('.', ',')}` : 'Free';

          return (
          <tr
            key={item.id}
          >
            <td>{item.title}</td>
            <td>{item.description}</td>
            <td>{price}</td>
            <td>{`${item.user.firstName} ${item.user.lastName}`}</td>
            <td>
              {moment(items._createdAt).format('DD/MM/YYYY')}
            </td>
            <td className="d-flex justify-content-around">
              <div aria-label="edit" onClick={ev => handleEdit(ev, item.id)}><i className="fas fa-edit"></i></div>
              <div className={classnames(item._deletedAt === null ? 'soft-deleted' : 'soft-undeleted')} aria-label="delete" onClick={ev => handleDelete(ev, item.id, item._deletedAt === null ? 'softdelete' : 'softundelete', 'delete')}><i className="fas fa-trash-alt"></i></div>
              <div aria-label="delete-forever" onClick={ev => handleDelete(ev, item.id, 'delete')}><i className="fas fa-trash"></i></div>              
            </td>
          </tr>
        )})}
      </tbody>
    </table>
  );
};

export default ItemsTable;