var media = require('..');

media().render(document.body, function(el) {
  console.log('captured and playing to media element: ', el);
});