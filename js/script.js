$(document).ready(function () {
  // //burger
  // $('.menu-header__icon').click(function (e) {
  //   $('.menu-header__icon, .menu-header__menu').toggleClass('_active');
  //   $('body').toggleClass('_lock');
  // });

  //filter
  $(function () {
    let filter = $('[data-filter]');
    filter.on('click', function () {
      $(this).addClass('_selected');
      $(this).siblings().removeClass('_selected');

      let cat = $(this).data('filter');
      if (cat == 'all') {
        $('[data-cat]').removeClass('_hide');
      } else {
        $('[data-cat]').each(function () {
          let selectCat = $(this).data('cat');
          if (selectCat != cat) {
            $(this).addClass('_hide');
          } else {
            $(this).removeClass('_hide');
          }
        });
      }
    });
  });
});

function mapAdd() {
  let tag = document.createElement('script');
  tag.src = 'https://maps.google.com/maps/api/js?sensor=false&amp;key=&callback=mapInit';
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function mapInit(n = 1) {
  google.maps.Map.prototype.setCenterWithOffset = function (latlng, offsetX, offsetY) {
    var map = this;
    var ov = new google.maps.OverlayView();
    ov.onAdd = function () {
      var proj = this.getProjection();
      var aPoint = proj.fromLatLngToContainerPixel(latlng);
      aPoint.x = aPoint.x + offsetX;
      aPoint.y = aPoint.y + offsetY;
      map.panTo(proj.fromContainerPixelToLatLng(aPoint));
      //map.setCenter(proj.fromContainerPixelToLatLng(aPoint));
    };
    ov.draw = function () {};
    ov.setMap(this);
  };
  var markers = new Array();
  var infowindow = new google.maps.InfoWindow({
    //pixelOffset: new google.maps.Size(-230,250)
  });
  var locations = [
    [new google.maps.LatLng(59.3293234, 18.0685808)],
    [new google.maps.LatLng(59.913869, 10.752245)],
    [new google.maps.LatLng(52.52437, 13.41053)],
    [new google.maps.LatLng(40.416775, -3.70379)],
    [new google.maps.LatLng(41.902782, 12.496366)],
  ];
  var options = {
    zoom: 3,
    panControl: false,
    mapTypeControl: false,
    center: locations[0][0],
    styles: [
      {
        stylers: [
          {
            hue: '#007fff',
          },
          {
            saturation: 89,
          },
        ],
      },
      {
        featureType: 'water',
        stylers: [
          {
            color: '#ffffff',
          },
        ],
      },
      {
        featureType: 'administrative.country',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
    ],
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  var map = new google.maps.Map(document.getElementById('map'), options);
  var icon = {
    url: '../img/icons/Map_Marker.svg',
    scaledSize: new google.maps.Size(24, 29),
    anchor: new google.maps.Point(9, 10),
  };
  for (var i = 0; i < locations.length; i++) {
    var marker = new google.maps.Marker({
      icon: icon,
      position: locations[i][0],
      map: map,
    });
    google.maps.event.addListener(
      marker,
      'click',
      (function (marker, i) {
        return function () {
          for (var m = 0; m < markers.length; m++) {
            markers[m].setIcon(icon);
          }
          var cnt = i + 1;
          //infowindow.setContent(document.querySelector('.events-map__item_' + cnt).innerHTML);
          //infowindow.open(map, marker);
          marker.setIcon(icon);
          map.setCenterWithOffset(marker.getPosition(), 0, 0);
          setTimeout(function () {}, 10);
        };
      })(marker, i)
    );
    markers.push(marker);
  }
  if (n) {
    var nc = n - 1;
    setTimeout(function () {
      google.maps.event.trigger(markers[nc], 'click');
    }, 500);
  }
}
if (document.querySelector('#map')) {
  mapAdd();
}

const iconMenu = document.querySelector('.menu-header__icon');
const menuBody = document.querySelector('.menu-header__menu');
if (iconMenu) {
  iconMenu.addEventListener('click', function (e) {
    document.body.classList.toggle('_lock');
    iconMenu.classList.toggle('_active');
    menuBody.classList.toggle('_active');
  });
}

//прокрутка при клике

const menuLinks = document.querySelectorAll('.menu-header__link[data-goto]');
if (menuLinks.length > 0) {
  menuLinks.forEach((menuLink) => {
    menuLink.addEventListener('click', onMenuLinkClick);
  });

  function onMenuLinkClick(e) {
    const menuLink = e.target;
    if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
      const gotoBlock = document.querySelector(menuLink.dataset.goto);
      const gotoBlockValue =
        gotoBlock.getBoundingClientRect().top + scrollY - document.querySelector('header').offsetHeight;

      if (iconMenu.classList.contains('_active')) {
        document.body.classList.remove('_lock');
        iconMenu.classList.remove('_active');
        menuBody.classList.remove('_active');
      }

      window.scrollTo({
        top: gotoBlockValue,
        behavior: 'smooth',
      });
      e.preventDefault();
    }
  }
}
