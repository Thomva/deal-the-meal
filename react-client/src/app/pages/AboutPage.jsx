import { default as React} from 'react';

import { PageSection, LocationIcon, PhoneIcon, EmailIcon, TwitterIcon, InstagramIcon, FacebookIcon, Button, SearchHeader } from '../components';
import { ABOUT_TITLE, CONTACT_TITLE, CONTACT_ADDRESS, CONTACT_PHONE, CONTACT_EMAIL, PLACEHOLDER_EMAIL, LABEL_MESSAGE, LABEL_NAME, LABEL_EMAIL, PLACEHOLDER_NAME, PLACEHOLDER_MESSAGE, ABOUT_CONTENT } from '../strings';
import { Input, TextArea } from '../components/inputs';

const AboutPage = ({children}) => {

  const sendMailHandler = (e) => {
    e.preventDefault();
    console.log('send mail');
  }

  return (
    <>
      <SearchHeader />
      <PageSection classes="aboutPage page-section--centered" title={'About'}>
        <h1 className={'aboutPage__title aboutPage__title--main'}>{ABOUT_TITLE}</h1>
        <div className="aboutPage__content">
          <p className="aboutPage__contentParagraph" dangerouslySetInnerHTML={{__html: ABOUT_CONTENT}}></p>
        </div>
        <h1 className={'aboutPage__title'}>{CONTACT_TITLE}</h1>
        <div className="aboutPage__contactSection">
          <div className="aboutPage__info">
            <div className="aboutPage__generalInfo">
              <div className="aboutPage__infoElement">
                <LocationIcon classes="aboutPage__infoIcon" color="#ffffff" />
                <div className="aboutPage__infoText">{ CONTACT_ADDRESS }</div>
              </div>
              <div className="aboutPage__infoElement">
                <PhoneIcon classes="aboutPage__infoIcon" color="#ffffff" />
                <div className="aboutPage__infoText">{CONTACT_PHONE}</div>
              </div>
              <div className="aboutPage__infoElement">
                <EmailIcon classes="aboutPage__infoIcon" color="#ffffff" />
                <div className="aboutPage__infoText">{CONTACT_EMAIL}</div>
              </div>
            </div>
            <div className="aboutPage__social">
              <div className="aboutPage__socialLink">
                <InstagramIcon classes="aboutPage__socialIcon" />
              </div>
              <div className="aboutPage__socialLink">
                <TwitterIcon classes="aboutPage__socialIcon"/>
              </div>
              <div className="aboutPage__socialLink">
                <FacebookIcon classes="aboutPage__socialIcon"/>
              </div>
            </div>
          </div>

          <form className="aboutPage__contactForm">
            <Input isRequired={true} label={LABEL_NAME} type="text" name="contactName" placeholder={PLACEHOLDER_NAME} />
            <Input isRequired={true} label={LABEL_EMAIL} type="email" name="contactEmail" placeholder={PLACEHOLDER_EMAIL} />
            <TextArea isRequired={true} label={LABEL_MESSAGE} type="email" name="contactEmail" placeholder={PLACEHOLDER_MESSAGE} rows="10" />
            <Button classes="aboutPage__contactButton" onClick={sendMailHandler} text="Send Message" />
          </form>
        </div>
      </PageSection>
    </>
  );
};

export default AboutPage;