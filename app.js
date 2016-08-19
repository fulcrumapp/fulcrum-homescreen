var API_TOKEN = null;

function getCurrentToken() {
  return API_TOKEN;
  // return localStorage.getItem('token');
}

function setCurrentToken(token) {
  API_TOKEN = token;
  // localStorage.setItem('token', token)
}

function isAuthenticated() {
  return getCurrentToken() !== null;
}

$(function() {
  if (isAuthenticated()) {
    $('.apps').show();
  } else {
    $('.login').show();
  }

  $('.login-button').click(login);
});

function login(event) {
  event.preventDefault();

  var username = $("#email").val();
  var password = $("#password").val();

  $.ajax({
    type: "GET",
    url: "https://api.fulcrumapp.com/api/v2/users.json",
    contentType: "application/json",
    dataType: "json",
    headers: {
      "Authorization": "Basic " + btoa(username + ":" + password)
    },
    statusCode: {
      401: function() {
        alert("Incorrect credentials, please try again.");
      }
    },
    success: function (data) {
      var contexts = data.user.contexts.sort(function(a, b) {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });

      populateOrganizations(contexts);
    }
  });
}

function logout() {
  sessionStorage.removeItem("token");
  location.reload();
}

function populateOrganizations(orgs) {
  $('.orgs').html('');

  var links = orgs.map(function(context) {
    return '<a href="#" data-token="' + context.api_token + '">' + context.name + '</a>';
  });

  $('.orgs').html(links.join(''));
  $('.orgs a').click(function(event) {
    selectOrganization($(event.target).data('token'));
    event.preventDefault();
  });

  $('.orgs').show();
  $('.apps').hide();
  $('.login').hide();
}

function populateForms(forms) {
  $('.apps').html('');

  var links = forms.map(function(form) {
    var image = '';

    if (form.image) {
      image = '<img src="' + form.image_small + '" />';
    }

    return '<a href="#" data-name="' + form.name + '" data-id="' + form.id + '" data-image="' + (form.image_small ? form.image_small : '') + '">' + image + '<span>' + form.name + '</span></a>';
  });

  $('.apps').html(links.join(''));
  $('.apps a').click(function(event) {
    var target = $(event.currentTarget);

    selectApp(target.data('id'), target.data('name'), target.data('image'));
    event.preventDefault();
  });

  $('.orgs').hide();
  $('.apps').show();
  $('.login').hide();
}

function selectOrganization(token) {
  setCurrentToken(token);

  $.ajax({
    type: "GET",
    url: "https://api.fulcrumapp.com/api/v2/forms.json",
    contentType: "application/json",
    dataType: "json",
    headers: {
      "X-ApiToken": token
    },
    success: function (data) {
      var forms = data.forms.sort(function(a, b) {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });

      populateForms(forms);
    }
  });
}

function selectApp(id, name, image) {
  var template = window.AppTemplate;

  template = template.replace(/__TITLE__/g, name);
  template = template.replace(/__NAME__/g, name);
  template = template.replace(/__ICON__/g, image);
  template = template.replace(/__URL__/g, 'fulcrumapp://new-record?form_id=' + id);

  var imageLink = 'https://api.fulcrumapp.com/api/v2/forms/' + id + '/image_small?token=' + getCurrentToken();

  getDataURI(imageLink, function(dataURI) {
    template = template.replace(/__ICONURI__/g, dataURI);
    window.location = 'data:text/html;base64,' + btoa(template);
  });
}

function getDataURI(url, callback) {
  var image = new Image();

  image.crossOrigin = "Anonymous";
  image.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = 250;
    canvas.height = 250;
    canvas.getContext('2d').drawImage(this, 0, 0);

    callback(canvas.toDataURL('image/png'));
  };

  image.src = url;
}
