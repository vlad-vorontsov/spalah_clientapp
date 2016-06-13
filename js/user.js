var User = {
  authorize: function(userData, accessHeaders) {
    this.userData = userData;
    this.accessHeaders = accessHeaders;
    this.authorized = true;
    this.saveAccessHeaders(accessHeaders);
  },

  loadUser: function() {
    var headers = localStorage.getItem('accessHeaders');
    if (headers) {
      this.accessHeaders = JSON.parse(headers);
      this.authorized = true;
    } else {
      this.authorized = false;
    }
  },

  saveAccessHeaders: function(accessHeaders) {
    localStorage.setItem('accessHeaders', JSON.stringify(accessHeaders));
  },

  // Функция для обновления заголовка 'Access-Token' в localSorage
  // и в свойстве обьекта User
  updateAccessToken: function(token) {
    if (!token) return;

    var headers = JSON.parse(localStorage.getItem('accessHeaders'));
    headers['Access-Token'] = token;
    this.accessHeaders = headers;
    this.saveAccessHeaders(headers);
  },


  // Эта функция нужна чтобы не писать во всех колбеках запросов логику
  // для обновления токена 'Access-Token'. Данная функция оборачивает наши
  // колбеки добавляя новую логику. Такой подход называется декорирование.
  refreshTokenAndRunCallback: function(callback) {
    // Замыкаем this в текщей области видимости.
    var _that = this;

    // Возвращаем функцию которая будет обрабатывать успешный ответ от сервера.
    return function(data, textStatus, request) {
      // Обновляем заголовок Access-Token
      _that.updateAccessToken(request.getResponseHeader('Access-Token'));
      // Вызываем основной колбек запроса переденый аргументом в refreshTokenAndRunCallback.
      callback(data, textStatus, request);
    }
  }
};

/**
 * vlad@kultprosvet.net
 * qwerty123
 */
