import { default as React } from 'react';
import { default as classnames } from 'classnames';
import { AuthButton } from '.';

const LoginSignup = ({ classes }) => {
	return (
		<div className={classnames('loginSignup', classes)}>
			<AuthButton type="login" />
			<AuthButton type="signup" />
		</div>
	);
};

export default LoginSignup;
