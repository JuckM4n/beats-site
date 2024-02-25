let myMap;

const init = () => {
  myMap = new ymaps.Map("map", {
    center: [55.75, 37.61],
    zoom: 14,
    controls: []
  });

  const coords = [
    [55.752004, 37.576133],
    [55.751730, 37.603581],
    [55.755655, 37.619234]
  ];

  const myCollection = new ymaps.GeoObjectCollection({}, {
    draggable: false,
    iconLayout: 'default#image',
    iconImageHref: "/img/marker.svg",
    iconImageSize: [44, 54],
    iconImageOffset: [-3, -42]
  });

  coords.forEach(coord => {
    myCollection.add(new ymaps.Placemark(coord));
  });
  myMap.geoObjects.add(myCollection);
}

ymaps.ready(init);