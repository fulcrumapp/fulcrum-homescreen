function getCurrentToken() {
  return localStorage.getItem('token');
}

function setCurrentToken(token) {
  // localStorage.setItem('token', token)
}

function isAuthenticated() {
  return getCurrentToken() != null;
}

$(function() {
  if (window.location.hash && window.navigator.standalone) {
    var id = window.location.hash.toString().replace('#', '');

    var url = 'fulcrumapp://new-record?form_id=' + id;

    var e = document.getElementById('jump');

    $(e).attr('href', url);

    var ev = document.createEvent('MouseEvents');

    ev.initEvent('click',true,true,document.defaultView,1,0,0,0,0,false,false,false,false,0,null);

    setTimeout(function() { e.dispatchEvent(ev); }, 25);
    return;
  }

  if (isAuthenticated()) {
    $('.apps').show();
  } else {
    $('.login').show();
  }

  $('.login-button').click(login);
});

function login() {
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
  $('.app').hide();
  $('.login').hide();
}

function showForm(id, name, imageURL) {
  var image = '';

  if (imageURL) {
    image = '<img src="' + imageURL + '" />';
  }

  var html = image + '<h1>' + name + '</h1>';

  html += '<small>You can now add this app to your homescreen.</small>';

  $('.app').html(html);

  $('.orgs').hide();
  $('.apps').hide();
  $('.app').show();
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
  window.location.hash = id;
  document.title = name;
  $('link[rel="apple-touch-icon-precomposed"]').attr('href', image);
  showForm(id, name, image);
}
