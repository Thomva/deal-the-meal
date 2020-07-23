import { default as React, Fragment } from 'react';
import Logo from '../_static/images/logos/Logo-Long.svg';

import { PageSection, ArrowIcon, Button, AuthButton, LoginSignup } from '../components';
import * as Routes from '../routes';
import {
	TAGLINE,
	HOWTO_MAIN_TITLE,
	HOWTO_GETTING_ONE_TITLE,
	HOWTO_GETTING_TITLE,
	HOWTO_GETTING_TWO_TITLE,
	HOWTO_GETTING_THREE_TITLE,
	HOWTO_GETTING_TWO_PARAGRAPH,
	HOWTO_GETTING_THREE_PARAGRAPH,
	HOWTO_SHARING_TITLE,
	HOWTO_SHARING_ONE_TITLE,
	HOWTO_SHARING_TWO_TITLE,
	HOWTO_SHARING_TWO_PARAGRAPH,
	HOWTO_SHARING_THREE_TITLE,
	HOWTO_SHARING_THREE_PARAGRAPH,
	SUGGESTION_TITLE,
} from '../strings';
import { Searchbar } from '../components/search';
import { Link } from 'react-router-dom';
import { CardCarousel } from '../components';
import { useRef } from 'react';
import FoldDivider from '../components/fold/FoldDivider';

const HomePage = ({ children }) => {
	const suggestionsElement = useRef();

	const onScrollClick = () => {
		const location =
			suggestionsElement &&
			suggestionsElement.current.getBoundingClientRect().top;
		window.scrollTo({ top: location - 100, behavior: 'smooth' });
	};

	return (
		<Fragment>
			<PageSection
				classes="home page-section--centered page-section--no-space-above"
				title={'Home'}
				readMoreRoute={'/posts'}
			>
				<section className="home-full">
					<div className="home-full__top logo-container">
						<img
							src={Logo}
							width="30"
							height="30"
							className="logo logo--large logo--center"
							alt="Deal the Meal Logo"
						/>
						<h2 className="tagline">{TAGLINE}</h2>
					</div>
					<div className="home-full__bottom">
						<Searchbar />
						<div onClick={onScrollClick}>
							<ArrowIcon
								classes="icon--clickable icon--turn90"
								color="#ff6c31"
							/>
						</div>
					</div>
				</section>

				<FoldDivider />

				<section
					id="homeSuggestions"
					className="home-suggestions"
					ref={suggestionsElement}
				>
					<h1>{SUGGESTION_TITLE}</h1>
					<CardCarousel max="9" />
					<Link to={Routes.RESULTS}>
						<Button classes="home-suggestions__button" text="More" />
					</Link>
				</section>

				<section className="home-howto">
					<h1 className="home-howto__title--main">{HOWTO_MAIN_TITLE}</h1>

					<section className="home-howto__section">
						<h1 className="home-howto__title">{HOWTO_GETTING_TITLE}</h1>
						<h2 className="home-howto__subtitle">{HOWTO_GETTING_ONE_TITLE}</h2>
						<LoginSignup classes="home-howto__loginSignup" />
						<h2 className="home-howto__subtitle">{HOWTO_GETTING_TWO_TITLE}</h2>
						<p className="home-howto__paragraph">
							{HOWTO_GETTING_TWO_PARAGRAPH}
						</p>
						<h2 className="home-howto__subtitle">
							{HOWTO_GETTING_THREE_TITLE}
						</h2>
						<p className="home-howto__paragraph">
							{HOWTO_GETTING_THREE_PARAGRAPH}
						</p>
					</section>

					<section className="home-howto__section">
						<h1 className="home-howto__title">{HOWTO_SHARING_TITLE}</h1>
						<h2 className="home-howto__subtitle">{HOWTO_SHARING_ONE_TITLE}</h2>
						<LoginSignup classes="home-howto__loginSignup" />
						<h2 className="home-howto__subtitle">{HOWTO_SHARING_TWO_TITLE}</h2>
						<p className="home-howto__paragraph">
							{HOWTO_SHARING_TWO_PARAGRAPH}
						</p>
						<h2 className="home-howto__subtitle">
							{HOWTO_SHARING_THREE_TITLE}
						</h2>
						<p className="home-howto__paragraph">
							{HOWTO_SHARING_THREE_PARAGRAPH}
						</p>
					</section>
				</section>
			</PageSection>
		</Fragment>
	);
};

export default HomePage;
