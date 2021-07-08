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
]
