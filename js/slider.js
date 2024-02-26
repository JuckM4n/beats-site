const mobileDetection = new MobileDetect(window.navigator.userAgent);
const Mobile = mobileDetection.mobile();

const slider = $(".slider__list").bxSlider({
  pager: false,
  controls: false,
  touchEnabled: false
});

if (Mobile) {
  slider.bxSlider({
    touchEnabled: true
  });
}

$(".slider__arrow--left").click(e => {
  e.preventDefault();
  slider.goToPrevSlide();
});

$(".slider__arrow--right").click(e => {
  e.preventDefault();
  slider.goToNextSlide();
})