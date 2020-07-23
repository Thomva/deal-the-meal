import React, { } from 'react';
import { useHistory, Link } from 'react-router-dom';

import * as Routes from '../../routes';
import { MessageList } from '../components';

const MessagesPage = ({ children }) => {
  let history = useHistory();

  const handleEdit = (messageId) => {
    console.log('edit: ', messageId);
    history.push(Routes.BACKOFFICE_MESSAGES_EDIT.replace(':id', messageId));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Link className="btn btn-primary" to={Routes.BACKOFFICE_MESSAGES_CREATE}>Create Item</Link>
        </div>
        <MessageList className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 post-list" limit={10} skip={1} onEdit={handleEdit} />:
      </div>
    </div>
  )
};
export default MessagesPage;