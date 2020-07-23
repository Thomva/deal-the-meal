import { default as React } from 'react';
import { PageSection } from '../section';

const LoadingIndicator = () => {
  console.log('loading');
  return (
    <PageSection>
      <div className="loadingIndicator">Loading...</div>
    </PageSection>
  );
};

export default LoadingIndicator;