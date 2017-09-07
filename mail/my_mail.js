
sendForm = function(){
  // event.preventDefault

  dataHash = {
    'name' : $('#name').val(),
    '_replyto' : $('#email').val(),
    'phone' : $('#phone').val(),
    'message' : $('#message').val()
      }

  $.ajax({
    url: 'https://formspree.io/thale.android@gmail.com',
    method: 'POST',
    dataType: 'json',
    data: dataHash
  }).always(function(){
    console.log('done')
    $('#success').html("<div class='alert alert-success'>");
    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
        .append("</button>");
    $('#success > .alert-success')
        .append("<strong>Thank you "+ $('#name').val()+", your message has been sent. I will get back to you as soon as possible!</strong>");
    $('#success > .alert-success')
        .append('</div>');
    $('form')[0].reset()
  })
}


$(function(){
  $('form').on('submit', function(event){
    event.preventDefault()
    sendForm()
  })
})