'use strict';

var ADS_AMOUNT = 8;
var AD_PRICE_MIN = 1000;
var AD_PRICE_MAX = 1000000;
var AD_ROOMS_MIN = 1;
var AD_ROOMS_MAX = 5;

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

var getRandomArray = function (arr, min, max) {
  var randomArray = [];
  var randomLength = getRandomNumber(min, max);

  for (var i = 0; i < randomLength; i++) {
    randomArray.push(arr[i]);
  }

  return randomArray;
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

var removeElements = function (el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

var getAvatars = function () {
  var avatars = [];

  for (var i = 1; i <= ADS_AMOUNT; i++) {
    avatars.push(i);
  }

  return avatars;
};

var getAdsList = function () {
  var adsList = [];
  var avatars = getAvatars();
  var avatarsCopy = avatars.slice();
  var titlesCopy = titles.slice();
  var housingTypesArrray = Object.keys(housingTypes);

  for (var i = 0; i < ADS_AMOUNT; i++) {
    var locationX = getRandomNumber(PIN_X_MIN, PIN_X_MAX);
    var locationY = getRandomNumber(PIN_Y_MIN, PIN_Y_MAX);

    var adItem = {
      author: {
        avatar: 'img/avatars/user0' + getRandomUniqueValue(avatarsCopy) + '.png'
      },
      offer: {
        title: getRandomUniqueValue(titlesCopy),
        address: locationX + ', ' + locationY,
        price: getRandomNumber(AD_PRICE_MIN, AD_PRICE_MAX),
        type: getRandomValue(housingTypesArrray),
        rooms: getRandomNumber(AD_ROOMS_MIN, AD_ROOMS_MAX),
        guests: getRandomNumber(AD_ROOMS_MIN, AD_ROOMS_MAX),
        checkin: getRandomValue(checkinTimes),
        checkout: getRandomValue(checkinTimes),
        features: getRandomArray(features, 1, features.length),
        description: '',
        photos: shuffleArray(photos)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };

    adsList.push(adItem);
  }

  return adsList;
};

var getFeaturesFragment = function (featuresArr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < featuresArr.length; i++) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature', 'popup__feature--' + features[i]);
    fragment.appendChild(feature);
  }

  return fragment;
};

var getPhotosFragment = function (photosArr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photosArr.length; i++) {
    var photo = document.createElement('img');

    photo.classList.add('popup__photo');
    photo.src = photosArr[i];
    photo.width = PHOTO_WIDTH;
    photo.height = PHOTO_HEIGHT;
    photo.alt = PHOTO_ALT;

    fragment.appendChild(photo);
  }

  return fragment;
};

var createPin = function (adItem) {
  var pin = pinTemplate.cloneNode(true);
  var pinImg = pin.querySelector('img');

  pin.style.left = adItem.location.x + 'px';
  pin.style.top = adItem.location.y + 'px';
  pinImg.src = adItem.author.avatar;
  pinImg.alt = adItem.offer.title;

  return pin;
};

var createCard = function (adItem) {
  var card = cardTemplate.cloneNode(true);
  var cardFeatures = card.querySelector('.popup__features');
  var cardPhotos = card.querySelector('.popup__photos');

  card.querySelector('.popup__avatar').src = adItem.author.avatar;
  card.querySelector('.popup__title').textContent = adItem.offer.title;
  card.querySelector('.popup__text--address').textContent = adItem.offer.address;
  card.querySelector('.popup__text--price').textContent = adItem.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = housingTypes[adItem.offer.type];
  card.querySelector('.popup__text--capacity').textContent = adItem.offer.rooms + ' комнаты для ' + adItem.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + adItem.offer.checkin + ', выезд до ' + adItem.offer.checkout;
  card.querySelector('.popup__description').textContent = adItem.offer.description;

  removeElements(cardFeatures);
  cardFeatures.appendChild(getFeaturesFragment(adItem.offer.features));

  removeElements(cardPhotos);
  cardPhotos.appendChild(getPhotosFragment(adItem.offer.photos));

  return card;
};

var getElementsFragment = function (dataList, count, createElement) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    var element = createElement(dataList[i]);
    fragment.appendChild(element);
  }

  return fragment;
};

var renderPins = function () {
  var pinsContainerElement = map.querySelector('.map__pins');

  pinsContainerElement.appendChild(getElementsFragment(adsList, ADS_AMOUNT, createPin));
};

var renderCard = function () {
  var mapFilters = map.querySelector('.map__filters-container');

  map.insertBefore(getElementsFragment(adsList, 1, createCard), mapFilters);
};

var adsList = getAdsList();
renderPins();
renderCard();

map.classList.remove('map--faded');
