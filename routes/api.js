module.exports = [
  {
    method: 'get',
    path: '/',
    resolver: {
      controller: 'WelcomeController',
      action: 'home',
    },
  },
  {
    method: 'get',
    path: '**404',
    resolver: {
      controller: 'WelcomeController',
      action: 'notFound',
    },
  },

  // Users
  {
    method: 'get',
    path: '/api/v1/users',
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
    path: '/api/v1/users/:id',
    resolver: {
      controller: 'UserController',
      action: 'getById',
    }
  },
  {
    method: 'delete',
    path: '/api/v1/users/:id',
    resolver: {
      controller: 'UserController',
      action: 'deleteById',
    }
  },
  {
    method: 'put',
    path: '/api/v1/users/:id',
    resolver: {
      controller: 'UserController',
      action: 'update',
    }
  },

]
