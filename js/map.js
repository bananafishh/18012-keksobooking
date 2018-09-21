'use strict';

var OFFERS_AMOUNT = 8;
var OFFER_PRICE_MIN = 1000;
var OFFER_PRICE_MAX = 1000000;
var OFFER_ROOMS_MIN = 1;
var OFFER_ROOMS_MAX = 5;

var PIN_X_MIN = 0;
var PIN_X_MAX = 1130;
var PIN_Y_MIN = 130;
var PIN_Y_MAX = 630;

var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 40;
var PHOTO_ALT = 'Фотография жилья';

var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var housingTypes = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var checkinTimes = [
  '12:00',
  '13:00',
  '14:00'
];

var features = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var getRandomValue = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomUniqueValue = function (arr) {
  var randomIndex = Math.floor(Math.random() * arr.length);

  return arr.splice(randomIndex, 1)[0];
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var shuffleArray = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    var temp = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = temp;
  }

  return arr;
};

var getAvatars = function () {
  var avatars = [];

  for (var i = 1; i <= OFFERS_AMOUNT; i++) {
    avatars.push(i);
  }

  return avatars;
};

var getFeaturesList = function () {
  var featuresList = [];
  var randomLength = getRandomNumber(1, features.length);

  for (var i = 0; i < randomLength; i++) {
    var feature = '<li class="popup__feature popup__feature--' + features[i] + '"></li>';
    featuresList.push(feature);
  }

  return featuresList.join('');
};

var getPhotosList = function () {
  var photosList = [];

  shuffleArray(photos);

  for (var i = 0; i < photos.length; i++) {
    var photo = '<img src="' + photos[i] + '" class="popup__photo" width="' + PHOTO_WIDTH + '" height="' + PHOTO_HEIGHT + '" alt="' + PHOTO_ALT + '">';
    photosList.push(photo);
  }

  return photosList.join('');
};

var getOffersList = function () {
  var offersList = [];
  var avatars = getAvatars();
  var avatarsCopy = avatars.slice();
  var titlesCopy = titles.slice();
  var housingTypesArrray = Object.keys(housingTypes);

  for (var i = 0; i < OFFERS_AMOUNT; i++) {
    var locationX = getRandomNumber(PIN_X_MIN, PIN_X_MAX);
    var locationY = getRandomNumber(PIN_Y_MIN, PIN_Y_MAX);

    var offerItem = {
      author: {
        avatar: 'img/avatars/user0' + getRandomUniqueValue(avatarsCopy) + '.png'
      },
      offer: {
        title: getRandomUniqueValue(titlesCopy),
        address: locationX + ', ' + locationY,
        price: getRandomNumber(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
        type: getRandomValue(housingTypesArrray),
        rooms: getRandomNumber(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        guests: getRandomNumber(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        checkin: getRandomValue(checkinTimes),
        checkout: getRandomValue(checkinTimes),
        features: getFeaturesList(),
        description: '',
        photos: getPhotosList()
      },
      location: {
        x: locationX,
        y: locationY
      }
    };

    offersList.push(offerItem);
  }

  return offersList;
};

var createPin = function (offerData) {
  var pin = pinTemplate.cloneNode(true);
  var pinImg = pin.querySelector('img');

  pin.style.left = offerData.location.x + 'px';
  pin.style.top = offerData.location.y + 'px';
  pinImg.src = offerData.author.avatar;
  pinImg.alt = offerData.offer.title;

  return pin;
};

var createCard = function (offerData) {
  var card = cardTemplate.cloneNode(true);

  card.querySelector('.popup__avatar').src = offerData.author.avatar;
  card.querySelector('.popup__title').textContent = offerData.offer.title;
  card.querySelector('.popup__text--address').textContent = offerData.offer.address;
  card.querySelector('.popup__text--price').textContent = offerData.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = housingTypes[offerData.offer.type];
  card.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
  card.querySelector('.popup__features').innerHTML = offerData.offer.features;
  card.querySelector('.popup__description').textContent = offerData.offer.description;
  card.querySelector('.popup__photos').innerHTML = offerData.offer.photos;

  return card;
};

var renderElements = function (offers, amount, createElement) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < amount; i++) {
    var element = createElement(offers[i]);
    fragment.appendChild(element);
  }

  return fragment;
};

var addPins = function () {
  var pinsContainerElement = map.querySelector('.map__pins');

  pinsContainerElement.appendChild(renderElements(offersList, OFFERS_AMOUNT, createPin));
};

var addCards = function () {
  var mapFilters = map.querySelector('.map__filters-container');

  map.insertBefore(renderElements(offersList, 1, createCard), mapFilters);
};

var offersList = getOffersList();
addPins();
addCards();

map.classList.remove('map--faded');
