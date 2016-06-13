var SignUp = {
  init: function() {
    User.loadUser();
    if (User.authorized) {
      window.location.replace('/spalah/clientapp/index.html');
    }
    this.emailInput = document.getElementById('exampleInputEmail1');
    this.passInput = document.getElementById('exampleInputPassword1');
    this.passConfirmInput = document.getElementById('exampleInputPassword2');
    this.initEvents();
  },

  initEvents: function() {
    document.getElementById('submitBtn').addEventListener('click', this.signUpUser.bind(this));
  },

  signUpUser: function() {
    event.preventDefault();

    var requestObject = {
      email: this.emailInput.value,
      password: this.passInput.value,
      password_confirmation: this.passConfirmInput.value
    };

    for (var errorKey in requestObject) {
      document.getElementById(errorKey).classList.remove('has-error'); 
    }
    
    $.ajax({
      url: 'http://spalah-home.herokuapp.com/auth.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestObject),
      success: function(data, textStatus, request) {
        var accessHeaders = {
          'Access-Token': request.getResponseHeader('Access-Token'),
          'Client': request.getResponseHeader('Client'),
          'Uid': request.getResponseHeader('Uid'),
          'Token-Type': request.getResponseHeader('Token-Type')
        }; 
        User.authorize(data, accessHeaders);
      },
      error: function (request, textStatus, errorThrown) {
        document.getElementById('email').classList.add('has-error');
        document.getElementById('password').classList.add('has-error');
        document.getElementById('password_confirmation').classList.add('has-error');
      }
    });
  }
};