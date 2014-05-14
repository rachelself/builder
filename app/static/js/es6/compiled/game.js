(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#forest').on('click', '.tree.alive .grow', grow);
    $('#forest').on('click', '.tree.alive.adult .chop', chop);
  }
  function login(e) {
    var data = $(this).closest('form').serialize();
    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: (function(response) {
        $('#login').prev().val('');
        $('#username').attr('data-id', response._id);
        $('#username').text(("Current User: " + response.username));
      })
    });
    e.preventDefault();
  }
  function seed() {
    var userId = $('#username').data('id');
    $.ajax({
      url: '/seed',
      type: 'POST',
      dataType: 'html',
      data: {userId: userId},
      success: (function(tree) {
        $('#forest').append(tree);
      })
    });
  }
  function getForest() {
    var userId = $('#username').data('id');
    $.ajax({
      url: ("/forest/" + userId),
      type: 'GET',
      dataType: 'html',
      success: (function(trees) {
        $('#forest').empty().append(trees);
      })
    });
  }
  function grow(e) {
    e.stopPropagation();
    var tree = $(this).parent();
    var treeId = tree.data('id');
    $.ajax({
      url: ("/tree/" + treeId + "/grow"),
      type: 'PUT',
      dataType: 'html',
      success: (function(t) {
        tree.replaceWith(t);
      })
    });
  }
  function chop(e) {
    e.stopPropagation();
    var tree = $(this).parent();
    var treeId = tree.data('id');
    var userId = $('#username').data('id');
    $.ajax({
      url: ("/tree/" + treeId + "/chop"),
      type: 'PUT',
      data: {userId: userId},
      success: (function(r) {
        tree.replaceWith(r.html);
        $('#balance > .balance-wood').text(r.user.wood);
      })
    });
  }
})();

//# sourceMappingURL=game.map
