/* jshint unused:false */

(function(){

  'use strict';

  $(document).ready(init);

  function init()
  {
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#forest').on('click', '.tree.alive .grow', grow);     // fn runs when you click on anything in #forest with classes of .tree AND .alive
    $('#forest').on('click', '.tree.alive.adult .chop', chop);
}

  function login(e)
  {
    var data = $(this).closest('form').serialize();

    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: response =>{

        $('#login').prev().val('');                    // resets form
        $('#username').attr('data-id', response._id);  // put the logged in user's name into a data attr of the div
        $('#username').text(`Current User: ${response.username}`);        // change text of div
      }

    });

    e.preventDefault();                                // keeps button from submitting
  }

  function seed()
  {
    var userId = $('#username').data('id');            // grab current user who wants to plant a seed

    $.ajax({
      url: '/seed',
      type: 'POST',
      dataType: 'html',                               // tells browser we're going to give it html data and not an object
      data: {userId:userId},                          // send data with userId
      success: tree =>{

        $('#forest').append(tree);                    // append html into the div

      }
    });
  }

  function getForest()                                // show the forest of a logged in user
  {
    var userId = $('#username').data('id');

    $.ajax({
      url: `/forest/${userId}`,
      type: 'GET',
      dataType: 'html',
      success: trees =>{
        $('#forest').empty().append(trees);

      }
    });
  }


  function grow(e)
  {
    e.stopPropagation();
    var tree = $(this).parent();                      // tree you just clicked on
    var treeId = tree.data('id');           // grab treeId out of the data attr

    $.ajax({
      url: `/tree/${treeId}/grow`,           // make that specific tree grow
      type: 'PUT',
      dataType: 'html',
      success: t =>{
        tree.replaceWith(t);                  // replace html on page with updated html that comes back in response

      }
    });
  }

  function chop(e)
  {
    e.stopPropagation();
    var tree = $(this).parent();
    var treeId = tree.data('id');
    var userId = $('#username').data('id');

    $.ajax({
      url: `/tree/${treeId}/chop`,
      type: 'PUT',
      data: {userId:userId},
      //dataType: 'html',
      success: r =>{
        // console.log(r.html);
        //console.log(r.user);
        tree.replaceWith(r.html);
        $('#balance > .balance-wood').text(r.user.wood);
      }
    });

    // updateDisplay(userId);
  }

  // function updateDisplay(userId)
  // {
  //   $.ajax({
  //     url: `/user`,
  //     type:
  //     success: r=>{
  //
  //     }
  //   });
  //
  //
  // }



})();
