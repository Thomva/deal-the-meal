import { default as React, useEffect, useState, Fragment } from 'react';
import { default as classnames } from 'classnames';

import $ from 'jquery'; 

import { useApi } from '../../../services';
import { useToast } from '../../services';

import ItemsTable from './ItemsTable';

import './ItemList.scss';

const ItemList = ({children, className, limit = 10, skip = 1, onEdit}) => {  
  const { deleteItem, findAllItems } = useApi();
  const { addToast } = useToast();
  const [ items, setItems ] = useState();
  const [ currentPageIndex, setCurrentPageIndex ] = useState(skip);
  const [ pagination, setPagination ] = useState({
    limit,
    page: skip,
    pages: 1,
    total: 1
  });
  const [ itemToDelete, setItemToDelete ] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {        
      const data = await findAllItems({
        limit: pagination.limit,
        skip: currentPageIndex,
        showDeleted: true,
      });
      setItems(data.docs);
      setPagination({ 
        limit: data.limit, 
        page: data.page, 
        pages: data.pages, 
        total: data.total 
      });
    }

    if (itemToDelete === null) {
      fetchItems();
    }
    
  }, [findAllItems, currentPageIndex, itemToDelete, pagination.limit]);

  const handlePage = (ev, pageIndex) => {
    ev.preventDefault();

    setCurrentPageIndex(pageIndex);
  }

  const handleDelete = (itemId, mode) => {
    setItemToDelete({
      item: items.find(item => item.id === itemId),
      mode,
    });
    
    $('#confirmModal').modal('show');
  }

  const handleDeleteConfirm = async () => {
    const deletedItem = await deleteItem(itemToDelete.item.id, itemToDelete.mode);

    addToast({
      title: `Admin: Item`,
      message: `Succesfully ${itemToDelete.mode} the item with id ${deletedItem.id} and title ${deletedItem.title}`
    });

    $('#confirmModal').modal('hide');

    setItemToDelete(null);
  }

  const handleEdit = (itemId) => {
    if (typeof onEdit === 'function') {
      onEdit(itemId);
    }
  }

  return (
    <div className={className}>
      <div className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Items</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <ItemsTable items={items} onDelete={handleDelete} onEdit={handleEdit}  />
          </div>          
        </div>
        <div className="card-footer">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
              {(pagination.page > 1) ? (<li className="page-item"><button className="page-link" onClick={ev => handlePage(ev, pagination.page - 1)}>Previous</button></li>) : ''}
              {
                Array(pagination.pages).fill(true).map((item, index) => (
                  <li key={index} className={classnames('page-item', (pagination.page === index + 1) ? 'active' : '' )}><button className="page-link" onClick={ev => handlePage(ev, index + 1)}>{index + 1}</button></li>
                ))
              }
              {(pagination.page !== pagination.pages) ? (<li className="page-item"><button className="page-link" onClick={ev => handlePage(ev, pagination.page + 1)}>Next</button></li>) : ''}                
            </ul>
          </nav>
        </div>
      </div>
      <div className="modal fade" id="confirmModal" tabIndex="-1" role="dialog" aria-labelledby="confirmModal" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{!!itemToDelete ? (
                <Fragment>{itemToDelete.mode} the selected item</Fragment>
              ) : ''}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {!!itemToDelete ? (
                <p>Dou yo wish to {itemToDelete.mode} the item with id: {itemToDelete.item.id} and title: {itemToDelete.item.title}?</p>
              ) : ''}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={ev => handleDeleteConfirm(ev)}>{!!itemToDelete ? (
                <Fragment>{itemToDelete.mode}</Fragment>
              ) : ''}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemList;