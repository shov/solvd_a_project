module.exports = [
  {
    method: 'get',
    path: '/',
    resolver: {
      controller: 'WelcomeController',
      action: 'home',
    },
  },

  //Tokens
  {
    method: 'post',
    path: '/api/v1/users/:userId(\\d+)/tokens',
    resolver: {
      controller: 'TokenController',
      action: 'create',
    }
  },
  {
    method: 'delete',
    path: '/api/v1/tokens/:token',
    resolver: {
      controller: 'TokenController',
      action: 'delete',
    }
  },


  //Users
  {
    method: 'get',
    path: '/api/v1/users',
    // TODO roles
    resolver: {
      controller: 'UserController',
      action: 'list',
    }
  },
  {
    method: 'post',
    path: '/api/v1/users',
    resolver: {
      controller: 'UserController',
      action: 'create',
    }
  },
  {
    method: 'get',
    path: '/api/v1/users/:id(\\d+)',
    middleware: ['AuthMiddleware'],
    resolver: {
      controller: 'UserController',
      action: 'getById',
    }
  },
  {
    method: 'delete',
    path: '/api/v1/users/:id(\\d+)',
    middleware: ['AuthMiddleware'],
    resolver: {
      controller: 'UserController',
      action: 'deleteById',
    }
  },
  {
    method: 'put',
    path: '/api/v1/users/:id(\\d+)',
    middleware: ['AuthMiddleware'],
    resolver: {
      controller: 'UserController',
      action: 'update',
    }
  },

  {
    method: 'use',
    path: '*',
    resolver: {
      controller: 'WelcomeController',
      action: 'notFound',
    },
  },
]
