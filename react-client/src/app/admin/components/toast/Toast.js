import React, { } from 'react';
import moment from 'moment';

import Logo from '../../../_static/images/logo192.png';

const Toast = ({ children, toast }) => {

  return (
    <div className="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay={3168}>
      <div className="toast-header">
        <img src={Logo} width="32" className="rounded mr-2" alt="" />
        <strong className="mr-auto">{toast.title}</strong>
        <small className="text-muted">{moment(toast._createdAt).format('DD/MM/YYYY')}</small>
        <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="toast-body">
        {toast.message}
      </div>
    </div>
  )
};
export default Toast;