import { default as React, useEffect, useState, Fragment } from 'react';
import { default as classnames } from 'classnames';

import $ from 'jquery'; 

import { useApi } from '../../../services';
import { useToast } from '../../services';

import RolesTable from './RolesTable';

import './RoleList.scss';

const RoleList = ({children, className, limit = 10, skip = 1, onEdit}) => {  
  const { deleteRole, findAllRoles } = useApi();
  const { addToast } = useToast();
  const [ roles, setRoles ] = useState();
  const [ currentPageIndex, setCurrentPageIndex ] = useState(skip);
  const [ pagination, setPagination ] = useState({
    limit,
    page: skip,
    pages: 1,
    total: 1
  });
  const [ roleToDelete, setRoleToDelete ] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {        
      const data = await findAllRoles({
        limit: pagination.limit,
        skip: currentPageIndex
      });
      setRoles(data);
      setPagination({ 
        limit: data.limit, 
        page: data.page, 
        pages: data.pages, 
        total: data.total 
      });
    }

    if (roleToDelete === null) {
      fetchRoles();
    }
    
  }, [findAllRoles, currentPageIndex, roleToDelete, pagination.limit]);

  const handlePage = (ev, pageIndex) => {
    ev.preventDefault();

    setCurrentPageIndex(pageIndex);
  }

  const handleDelete = (roleId, mode) => {
    setRoleToDelete({
      role: roles.find(role => role.id === roleId),
      mode,
    });
    
    $('#confirmModal').modal('show');
  }

  const handleDeleteConfirm = async () => {
    const deletedRole = await deleteRole(roleToDelete.role.id, roleToDelete.mode);

    addToast({
      title: `Admin: Role`,
      message: `Succesfully ${roleToDelete.mode} the role with id ${deletedRole.id} and title ${deletedRole.title}`
    });

    $('#confirmModal').modal('hide');

    setRoleToDelete(null);
  }

  const handleEdit = (roleId) => {
    if (typeof onEdit === 'function') {
      onEdit(roleId);
    }
  }

  return (
    <div className={className}>
      <div className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Roles</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <RolesTable roles={roles} onDelete={handleDelete} onEdit={handleEdit}  />
          </div>          
        </div>
        <div className="card-footer">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
              {(pagination.page > 1) ? (<li className="page-role"><button className="page-link" onClick={ev => handlePage(ev, pagination.page - 1)}>Previous</button></li>) : ''}
              {
                Array(pagination.pages).fill(true).map((role, index) => (
                  <li key={index} className={classnames('page-role', (pagination.page === index + 1) ? 'active' : '' )}><button className="page-link" onClick={ev => handlePage(ev, index + 1)}>{index + 1}</button></li>
                ))
              }
              {(pagination.page !== pagination.pages) ? (<li className="page-role"><button className="page-link" onClick={ev => handlePage(ev, pagination.page + 1)}>Next</button></li>) : ''}                
            </ul>
          </nav>
        </div>
      </div>
      <div className="modal fade" id="confirmModal" tabIndex="-1" role="dialog" aria-labelledby="confirmModal" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{!!roleToDelete ? (
                <Fragment>{roleToDelete.mode} the selected role</Fragment>
              ) : ''}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {!!roleToDelete ? (
                <p>Dou yo wish to {roleToDelete.mode} the role with id: {roleToDelete.role.id} and title: {roleToDelete.role.title}?</p>
              ) : ''}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={ev => handleDeleteConfirm(ev)}>{!!roleToDelete ? (
                <Fragment>{roleToDelete.mode}</Fragment>
              ) : ''}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleList;