import { default as React} from 'react';

const NotFoundPage = ({children}) => {
  return (
    <div className="">
      <h1 className="title">404</h1>
      <p className="sub-title">We couldn't find the page you are looking for.</p>
      <p className="description">Try searching or go to <a href="/" target="_self">Full Stack New Media Development homepage.</a></p>
    </div>
  );
};

export default NotFoundPage;