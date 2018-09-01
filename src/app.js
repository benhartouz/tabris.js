const {ImageView, ScrollView, ui, Button, TextView} = require('tabris');

const { WebView } = require('tabris');

const {app} = require('tabris');

const ALBUMS = require('../albums/albums.json');

const IMAGE_SIZE = 96;

let URL = ALBUMS[0].url;

class AlbumsView extends ScrollView {

  constructor(properties) {
    super(properties);
    this.resetHideTimeout();
  }

  isShowing() {
    return this.transform.translationY === 0;
  }

  show() {
    this.animate({transform: {translationY: 0}}, {easing: 'ease-out'});
  }

  hide() {
    this.animate({transform: {translationY: this.bounds.height}}, {easing: 'ease-out'});
  }

  toggleShowing() {
    if (this.isShowing()) {
      this.hide();
    } else {
      this.show();
      this.resetHideTimeout();
    }
  }

  resetHideTimeout() {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => this.hide(), 4000);
  }
}

ui.contentView.background = 'black';
ui.statusBar.set({
  displayMode: 'float',
  theme: 'dark',
  background: '#00000044'
});

let fullImage = new ImageView({
  top: 0, bottom: 0, left: 0, right: 0,
  image: `${ALBUMS[0].image}`,
  scaleMode: 'fit',
  zoomEnabled: true
}).on('tap', () => albumView.toggleShowing())
  .appendTo(ui.contentView);

let albumView = new AlbumsView({
  left: 0, right: 0, bottom: 0, height: 112,
  direction: 'horizontal',
  background: '#00000044'
}).on('scrollX', () => albumView.resetHideTimeout())
  .appendTo(ui.contentView);

let buttonBuy = new Button({
    left: 10, 
    right: 10, 
    top: 450,
    direction: 'horizontal',
    textColor: "blue",
    text: "Buy"
}).on('select', function(){
   app.launch(URL);
})
.appendTo(ui.contentView);

let title = new TextView({
    left: 10, 
    right: 10, 
    top: 60,
    textColor: "white",
    alignment: 'center',
    size: 60,
    text: ALBUMS[0].title
})
.appendTo(ui.contentView); 

ALBUMS.forEach((album) => {
  new ImageView({
    top: 8,
    left: 'prev() 8',
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    image: {src: `${album.image}`,width: IMAGE_SIZE, height: IMAGE_SIZE}
  }).on('tap', () => {
    fullImage.image = `${album.image}`;
    title.text = `${album.title}`;
    URL = album.url;
    albumView.resetHideTimeout();
  }).appendTo(albumView);
});