import { installTwicpics, TwicImg, TwicPicture, TwicVideo } from '@twicpics/components/webcomponents';
import '@twicpics/components/style.css';

installTwicpics({
  "domain": "https://playlovetoys.twic.pics"
});

customElements.define('twic-img', TwicImg);
customElements.define('twic-picture', TwicPicture);
customElements.define('twic-video', TwicVideo);