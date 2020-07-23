import { default as React, useEffect, useContext, useState, createContext, Fragment } from 'react';

import $ from 'jquery';
import { Toast } from '../components/toast';

const ToastContext = createContext();
const useToast = () => useContext(ToastContext);

const ToastProvider = ({children}) => {
  const [ toasts, setToasts ] = useState([]);

  useEffect(() => {
    $('.toast').toast('show');
  }, [toasts]);

  const addToast = ({ title, message }) => {
    const tempToasts = JSON.parse(JSON.stringify(toasts));

    tempToasts.splice(0, 1, {
      title,
      message,
      createdAt: Date.now()
    });

    setToasts([
      ...tempToasts
    ]);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      <Fragment>
        {children}
      </Fragment>
      <div aria-live="polite" aria-atomic="true" style={{position: "fixed", minHeight: "200px", width: "312px", zIndex: 999, bottom: "16px", left: "-156px", marginLeft: "50%"}}>
        <div style={{position: "absolute", bottom: "0"}}>
        {
          toasts && toasts.map((toast, index) => (
            <Toast key={index} toast={toast} />
          ))}          
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export {
  ToastContext,
  ToastProvider,
  useToast,
}