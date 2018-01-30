function saveBtnHandler(btn){
    let link = btn.data('link');
    let saved = btn.data('saved');

    $.post({
        url: '/save',
        data: {
            link: link,
            saved: !saved
        }
    }).done(function(response){
        //delete row containing clicked button as it is now unsaved, and shouldn't be on the saved page
        btn.closest('.row').remove()
    });
};

function commentBtnHandler(btn){

    var link = btn.data('link');
    $('.modal-body').empty();
    
    $('#save-comment').data('link', link);

    $.post({
        url: '/comments/pop',
        data: {
            link: link
        }
    }).done(function(response){
        var cmnts = response.notes;

        for(i in cmnts){
            var cmnt = $('<p>- ' + cmnts[i].body + '</p>');
           $('.modal-body').append(cmnt);
        }
    });
    
    
    $('#comment-modal').modal('show')
}

function saveCommentBtnHandler(btn){
    var comment = $('#comment-text').val().trim();
    var link = btn.data('link');

    console.log(link);

    if(comment === ""){
        //can't enter blank comment
    }
    else{
        $.post({
            url: '/comment',
            data: {
                comment: comment,
                link: link
            }
        }).done(function(response){
            $('.modal-body').append($('<p>-' + comment + '</p>'));
            $('#comment-text').val('')
        });
    };
};


$(document).ready(function(){
    //bind buttons to their handlers
    $('.save-button').on('click', function(ev){
        saveBtnHandler($(this));
    });

    $('.comment-button').on('click', function(ev){
        commentBtnHandler($(this));
    });

    $('#save-comment').on('click', function(ev){
        saveCommentBtnHandler($(this));
    })

    //re-assign or button values so it is still useful
    $('#article-btn').attr('href', '/articles');
    $('#article-btn').html('All Articles');
    
    //delete the scrape button. I don't want people scraping from the saved page
    $('#scrape').remove();


});
