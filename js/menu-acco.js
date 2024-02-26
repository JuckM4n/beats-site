const measureWidth = (item) => {
  let reqItemWidth = 0;
  const screenWidth = $(window).width();
  const container = item.closest(".products-menu__list");
  const titlesBlocks = container.find(".products-menu__title");
  const titlesWidth = titlesBlocks.width() * titlesBlocks.length;

  const textContainer = item.find(".products-menu__content");
  const paddingLeft = parseInt(textContainer.css("padding-left"));
  const paddingRight = parseInt(textContainer.css("padding-right"));

  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  if (isMobile) {
    reqItemWidth = screenWidth - titlesWidth;
  } else {
    reqItemWidth = 524;
  }

  return {
    containerWidth: reqItemWidth,
    textContainerWidth: reqItemWidth - paddingRight - paddingLeft
  }
};

const closeEveryItemInContainer = (container) => {
  const items = container.find(".products-menu__item");
  const content = container.find(".products-menu__content");

  items.removeClass("active");
  content.width(0);
};

const openItems = (item) => {
  const hiddenContent = item.find(".products-menu__content");
  const reqWidth = measureWidth(item);
  const textBlock = item.find(".products-menu__content");
  
  item.addClass("active");
  hiddenContent.width(reqWidth.container);
  textBlock.width(reqWidth.textContainerWidth);
};

$(".products-menu__title").on("click", e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const item = $this.closest(".products-menu__item");
  const itemOpened = item.hasClass("active");
  const container = $this.closest(".products-menu__list");

  if (itemOpened) {
    closeEveryItemInContainer(item);
  } else {
    closeEveryItemInContainer(container);
    openItems(item);
  }
});


