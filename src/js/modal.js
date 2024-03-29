const validateFields = (form, fieldsArray) => {

  fieldsArray.forEach((field) => {
    field.removeClass("input-error");
    if (field.val().trim() === "") {
      field.addClass("input-error");
    }
  });

  const errorFields = form.find(".input-error");

  return errorFields.length === 0;

}

$(".form").submit(e => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  const modal = $("#modal");
  const content = modal.find(".modal__content");

  modal.removeClass("error-modal");

  const isValid = validateFields(form, [name, phone, comment, to]);

  if (isValid) {
    const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val()
      },
    });
    request.done(data => {
      const message = "Cообщение отправлено";
      content.text(message);
    });
    request.fail(data => {
      const message = "Произошла ошибка";
      content.text(message);
      modal.addClass("error-modal");
    });
    request.always(() => {
      new Fancybox(
        [
          {
            src: "#modal",
            type: "inline",
          },
        ],
        {
          closeButton: false
        }
      );
    });
  }document.getElementById("form").reset();
});


$(".app-submit-btn").click(e => {
  e.preventDefault();

  Fancybox.close();
});

document.getElementById("form").reset();