import { default as React } from 'react';
import { default as classnames } from 'classnames';

const PageSection = ({children, classes, title, readMoreRoute}) => {
  return (
    <section className={classnames('page-section', classes)}>
              {children}
    </section>
  );
};

export default PageSection;