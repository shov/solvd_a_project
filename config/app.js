module.exports = {
  providers: [
    new (require(APP_PATH + '/app/serviceProviders/AppServiceProvider'))(),
  ],
  di: [
    {
      path: '/app/http/controllers',
    },
    {
      path: '/app',
      base: 'app',
      exclude: ['http'],
    },
  ],
}
